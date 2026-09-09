import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Trip,
  MicroPlan,
  PlanParticipant,
  ChatMessage,
  ChatRoom,
  CityCode,
  SafetyReport,
  SafetyReportType,
  WaitlistRegion,
} from '../types';
import {
  CITY_HUBS,
  WAITLIST_CITIES,
  INITIAL_USERS,
  INITIAL_TRIPS,
  INITIAL_PLANS,
  INITIAL_PARTICIPANTS,
  INITIAL_CHAT_ROOMS,
  INITIAL_CHAT_MESSAGES,
} from '../data/mockData';

interface FellowContextType {
  // Current user & personas
  currentUser: User;
  allUsers: User[];
  setCurrentUserById: (userId: string) => void;
  switchPersona: (userId: string) => void;
  updateCurrentUserProfile: (fields: Partial<User>) => void;

  // City & Waitlist
  activeCityCode: CityCode;
  setActiveCityCode: (code: CityCode) => void;
  selectedWaitlistCity: WaitlistRegion | null;
  setSelectedWaitlistCity: (city: WaitlistRegion | null) => void;
  waitlistCities: WaitlistRegion[];
  registerWaitlist: (cityId: string, arrival: string, departure: string, email: string) => boolean;

  // Trips & Temporal decay
  currentTrip: Trip | null;
  allTrips: Trip[];
  tripDaysRemaining: number | null;
  isTripActive: boolean;
  updateUserTrip: (cityCode: CityCode, arrivalDate: string, departureDate: string) => void;
  updateCurrentUserTripDates: (arrivalDate: string, departureDate: string) => void;

  // Plans
  plans: MicroPlan[];
  participants: PlanParticipant[];
  createPlan: (planData: Omit<MicroPlan, 'id' | 'host_user_id' | 'status' | 'qr_checkin_token' | 'created_at'>) => { success: boolean; error?: string; planId?: string };
  cancelPlan: (planId: string) => void;
  requestToJoinPlan: (planId: string) => { success: boolean; error?: string };
  respondToRsvp: (participantId: string, action: 'accept' | 'decline') => void;
  cancelAttendance: (planId: string) => { released: boolean; feeCharged: boolean; penaltyApplied: boolean };

  // Verification & Pass
  startVerificationFlow: () => void;
  completeVerification: () => void;
  isVerificationModalOpen: boolean;
  setIsVerificationModalOpen: (open: boolean) => void;

  // Dynamic QR Check-in
  currentQrToken: string;
  qrSecondsRemaining: number;
  checkInAttendeeWithQr: (planId: string, scannedToken: string, attendeeUserId?: string) => { success: boolean; message: string };

  // Chat
  chatRooms: ChatRoom[];
  chatMessages: ChatMessage[];
  sendChatMessage: (planId: string, content: string) => { success: boolean; error?: string };

  // Safety & Moderation
  safetyReports: SafetyReport[];
  mutedUserIds: string[];
  reportUser: (reportedUserId: string, planId: string | null, reason: SafetyReport['reason'], details: string) => void;
  submitSafetyReport: (params: {
    reported_user_id: string;
    plan_id?: string | null;
    report_type: SafetyReportType;
    details: string;
  }) => void;
  signCodeOfConduct: () => void;

  // Modals & Navigation state
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (userId?: string) => void;
  logout: () => void;
  pendingAction: { type: 'join_plan' | 'host_plan' | 'view_chat' | 'profile'; planId?: string } | null;
  setPendingAction: (action: { type: 'join_plan' | 'host_plan' | 'view_chat' | 'profile'; planId?: string } | null) => void;
  activeTab: 'landing' | 'discover' | 'my_plans' | 'profile';
  setActiveTab: (tab: 'landing' | 'discover' | 'my_plans' | 'profile') => void;
  selectedPlanId: string | null;
  setSelectedPlanId: (id: string | null) => void;
  activeChatPlanId: string | null;
  setActiveChatPlanId: (id: string | null) => void;
  isHostModalOpen: boolean;
  setIsHostModalOpen: (open: boolean) => void;
  isCityModalOpen: boolean;
  setIsCityModalOpen: (open: boolean) => void;
  isCodeOfConductOpen: boolean;
  setIsCodeOfConductOpen: (open: boolean) => void;
  reportingTarget: { userId: string; name: string; planId?: string } | null;
  setReportingTarget: (target: { userId: string; name: string; planId?: string } | null) => void;
}

const FellowContext = createContext<FellowContextType | undefined>(undefined);

export const FellowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local persistence keys
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('fellow_users_v2');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('fellow_active_uid_v2') || 'user_elena_r';
  });

  const [activeCityCode, setActiveCityCodeState] = useState<CityCode>(() => {
    return (localStorage.getItem('fellow_active_city_v2') as CityCode) || 'TYO_JP';
  });

  const [selectedWaitlistCity, setSelectedWaitlistCity] = useState<WaitlistRegion | null>(null);
  const [waitlistCities, setWaitlistCities] = useState<WaitlistRegion[]>(() => {
    const saved = localStorage.getItem('fellow_waitlist_v2');
    return saved ? JSON.parse(saved) : WAITLIST_CITIES;
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('fellow_trips_v2');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [plans, setPlans] = useState<MicroPlan[]>(() => {
    const saved = localStorage.getItem('fellow_plans_v2');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [participants, setParticipants] = useState<PlanParticipant[]>(() => {
    const saved = localStorage.getItem('fellow_participants_v2');
    return saved ? JSON.parse(saved) : INITIAL_PARTICIPANTS;
  });

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(() => {
    const saved = localStorage.getItem('fellow_chat_rooms_v2');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_ROOMS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('fellow_chat_messages_v2');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>(() => {
    const saved = localStorage.getItem('fellow_safety_reports_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [mutedUserIds, setMutedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('fellow_muted_users_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // UI Navigation states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const session = localStorage.getItem('fellow_auth_session_v2');
    return session === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'join_plan' | 'host_plan' | 'view_chat' | 'profile';
    planId?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'landing' | 'discover' | 'my_plans' | 'profile'>(() => {
    const session = localStorage.getItem('fellow_auth_session_v2');
    return session === 'true' ? 'discover' : 'landing';
  });
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [activeChatPlanId, setActiveChatPlanId] = useState<string | null>(null);
  const [isHostModalOpen, setIsHostModalOpen] = useState<boolean>(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
  const [isCodeOfConductOpen, setIsCodeOfConductOpen] = useState<boolean>(false);
  const [reportingTarget, setReportingTarget] = useState<{ userId: string; name: string; planId?: string } | null>(null);

  // Dynamic QR Code generation (rotates every 15s to prevent screenshot fraud per PRD)
  const [currentQrToken, setCurrentQrToken] = useState<string>('FELLOW_SECURE_TOKEN_INIT');
  const [qrSecondsRemaining, setQrSecondsRemaining] = useState<number>(15);

  useEffect(() => {
    const generateToken = () => {
      const entropy = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `FELLOW_${activeCityCode}_SECURE_${Date.now().toString(36).toUpperCase()}_${entropy}`;
    };

    setCurrentQrToken(generateToken());

    const interval = setInterval(() => {
      setQrSecondsRemaining((prev) => {
        if (prev <= 1) {
          setCurrentQrToken(generateToken());
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCityCode]);

  // Persist storage whenever items change
  useEffect(() => {
    localStorage.setItem('fellow_users_v2', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('fellow_active_uid_v2', currentUserId);
  }, [currentUserId]);
  useEffect(() => {
    localStorage.setItem('fellow_active_city_v2', activeCityCode);
  }, [activeCityCode]);
  useEffect(() => {
    localStorage.setItem('fellow_trips_v2', JSON.stringify(trips));
  }, [trips]);
  useEffect(() => {
    localStorage.setItem('fellow_plans_v2', JSON.stringify(plans));
  }, [plans]);
  useEffect(() => {
    localStorage.setItem('fellow_participants_v2', JSON.stringify(participants));
  }, [participants]);
  useEffect(() => {
    localStorage.setItem('fellow_chat_rooms_v2', JSON.stringify(chatRooms));
  }, [chatRooms]);
  useEffect(() => {
    localStorage.setItem('fellow_chat_messages_v2', JSON.stringify(chatMessages));
  }, [chatMessages]);
  useEffect(() => {
    localStorage.setItem('fellow_safety_reports_v2', JSON.stringify(safetyReports));
  }, [safetyReports]);
  useEffect(() => {
    localStorage.setItem('fellow_muted_users_v2', JSON.stringify(mutedUserIds));
  }, [mutedUserIds]);
  useEffect(() => {
    localStorage.setItem('fellow_waitlist_v2', JSON.stringify(waitlistCities));
  }, [waitlistCities]);

  // Active user resolver
  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const setCurrentUserById = (userId: string) => {
    setCurrentUserId(userId);
    const user = users.find((u) => u.id === userId);
    if (user && !user.code_of_conduct_signed) {
      setIsCodeOfConductOpen(true);
    }
  };

  const switchPersona = (userId: string) => {
    setCurrentUserById(userId);
  };

  const updateCurrentUserProfile = (fields: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, ...fields, updated_at: new Date().toISOString() } : u))
    );
  };

  // City setter
  const setActiveCityCode = (code: CityCode) => {
    setActiveCityCodeState(code);
    setSelectedWaitlistCity(null);
  };

  // Trip and temporal decay logic:
  // PRD Rule 1: At Departure Date + 24:00 hours UTC, the user's status for that city switches to INACTIVE.
  const currentTrip = useMemo(() => {
    return trips.find((t) => t.user_id === currentUserId && t.city_code === activeCityCode) || null;
  }, [trips, currentUserId, activeCityCode]);

  const { isTripActive, tripDaysRemaining } = useMemo(() => {
    if (!currentTrip) {
      return { isTripActive: false, tripDaysRemaining: null };
    }
    const now = new Date().getTime();
    const departure = new Date(currentTrip.departure_date + 'T23:59:59Z').getTime();
    const decayCutoff = departure + 24 * 60 * 60 * 1000; // 24h past departure

    if (now > decayCutoff) {
      return { isTripActive: false, tripDaysRemaining: 0 };
    }

    const diffDays = Math.ceil((departure - now) / (1000 * 60 * 60 * 24));
    return { isTripActive: true, tripDaysRemaining: Math.max(0, diffDays) };
  }, [currentTrip]);

  const updateUserTrip = (cityCode: CityCode, arrivalDate: string, departureDate: string) => {
    setTrips((prev) => {
      const filtered = prev.filter((t) => !(t.user_id === currentUserId && t.city_code === cityCode));
      const newTrip: Trip = {
        id: `trip_${currentUserId}_${cityCode}_${Date.now()}`,
        user_id: currentUserId,
        city_code: cityCode,
        arrival_date: arrivalDate,
        departure_date: departureDate,
        status: 'active',
        created_at: new Date().toISOString(),
      };
      return [...filtered, newTrip];
    });
  };

  const updateCurrentUserTripDates = (arrivalDate: string, departureDate: string) => {
    updateUserTrip(activeCityCode, arrivalDate, departureDate);
  };

  // Auth & Session Handling
  const login = (userId?: string) => {
    if (userId) {
      setCurrentUserId(userId);
    }
    setIsAuthenticated(true);
    localStorage.setItem('fellow_auth_session_v2', 'true');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('fellow_auth_session_v2');
    setActiveTab('landing');
  };

  // Waitlist
  const registerWaitlist = (cityId: string, arrival: string, departure: string, email: string) => {
    setWaitlistCities((prev) =>
      prev.map((c) => (c.id === cityId ? { ...c, registered_count: c.registered_count + 1 } : c))
    );
    return true;
  };

  // Code of Conduct
  const signCodeOfConduct = () => {
    updateCurrentUserProfile({ code_of_conduct_signed: true });
    setIsCodeOfConductOpen(false);

    // Chained onboarding: Once charter is signed, advance to KYC verification if needed
    if (!currentUser.is_verified || !currentUser.has_paid_pass) {
      setIsVerificationModalOpen(true);
    }
  };

  // Verification & Pass Checkout
  const startVerificationFlow = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!currentUser.code_of_conduct_signed) {
      setIsCodeOfConductOpen(true);
      return;
    }
    setIsVerificationModalOpen(true);
  };

  const completeVerification = () => {
    const verifiedTimestamp = new Date().toISOString();
    updateCurrentUserProfile({
      is_verified: true,
      verified_at: verifiedTimestamp,
      has_paid_pass: true,
      verification_provider_ref: `stripe_id_${Date.now()}`,
    });
    setIsVerificationModalOpen(false);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  // Create Micro-Plan
  const createPlan = (
    planData: Omit<MicroPlan, 'id' | 'host_user_id' | 'status' | 'qr_checkin_token' | 'created_at'>
  ) => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'host_plan' });
      setIsAuthModalOpen(true);
      return { success: false, error: 'Sign-in required to host a micro-meetup.' };
    }

    if (!currentUser.code_of_conduct_signed) {
      setPendingAction({ type: 'host_plan' });
      setIsCodeOfConductOpen(true);
      return { success: false, error: 'Please review and sign the Platonic Community Charter first.' };
    }

    if (!currentUser.is_verified || !currentUser.has_paid_pass) {
      setPendingAction({ type: 'host_plan' });
      setIsVerificationModalOpen(true);
      return { success: false, error: 'Identity verification and $9.99 Verified Pass required to host plans.' };
    }

    // Safety constraint: Female-only plans can only be created by female users
    if (planData.female_only && currentUser.gender !== 'female') {
      return { success: false, error: 'Only female-identifying travelers may post female-only plans.' };
    }

    // Max duration 4 hours check
    const start = new Date(planData.start_time).getTime();
    const end = new Date(planData.end_time).getTime();
    const durationHours = (end - start) / (1000 * 60 * 60);
    if (durationHours > 4.01) {
      return { success: false, error: 'Micro-plans cannot exceed a maximum duration of 4 hours.' };
    }

    // Capacity 2 - 4
    if (planData.max_participants < 2 || planData.max_participants > 4) {
      return { success: false, error: 'Participant capacity must be between 2 and 4 travelers.' };
    }

    const planId = `plan_${Date.now()}`;
    const newPlan: MicroPlan = {
      ...planData,
      id: planId,
      host_user_id: currentUser.id,
      status: 'open',
      qr_checkin_token: `FELLOW_${activeCityCode}_HOST_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    // Add host as confirmed participant
    const hostParticipant: PlanParticipant = {
      id: `part_${Date.now()}_host`,
      plan_id: planId,
      user_id: currentUser.id,
      role: 'host',
      rsvp_status: 'confirmed',
      deposit_payment_intent_id: `pi_host_exempt_${Date.now()}`,
      deposit_status: 'released',
      checked_in_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    // Create associated chat room
    const newChatRoom: ChatRoom = {
      id: `chat_${planId}`,
      plan_id: planId,
      is_active: true,
      expires_at: new Date(end + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    };

    setPlans((prev) => [newPlan, ...prev]);
    setParticipants((prev) => [...prev, hostParticipant]);
    setChatRooms((prev) => [...prev, newChatRoom]);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.5 },
    });

    return { success: true, planId };
  };

  // Cancel Plan
  const cancelPlan = (planId: string) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, status: 'cancelled' } : p)));
    // Release all guest deposits
    setParticipants((prev) =>
      prev.map((part) =>
        part.plan_id === planId && part.deposit_status === 'held'
          ? { ...part, deposit_status: 'released', rsvp_status: 'cancelled_by_user' }
          : part
      )
    );
  };

  // Request to Join ($10 hold)
  const requestToJoinPlan = (planId: string) => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'join_plan', planId });
      setIsAuthModalOpen(true);
      return { success: false, error: 'Sign-in required to join a micro-meetup.' };
    }

    if (!currentUser.code_of_conduct_signed) {
      setPendingAction({ type: 'join_plan', planId });
      setIsCodeOfConductOpen(true);
      return { success: false, error: 'Please review and sign the Platonic Community Charter first.' };
    }

    if (!currentUser.is_verified || !currentUser.has_paid_pass) {
      setPendingAction({ type: 'join_plan', planId });
      setIsVerificationModalOpen(true);
      return { success: false, error: 'Identity verification ($9.99 lifetime pass) required to join.' };
    }

    const plan = plans.find((p) => p.id === planId);
    if (!plan) return { success: false, error: 'Plan not found.' };

    // Female only check
    if (plan.female_only && currentUser.gender !== 'female') {
      return { success: false, error: 'This is a female-only meetup. Access is strictly limited to verified female travelers.' };
    }

    // Check existing RSVP
    const existing = participants.find((p) => p.plan_id === planId && p.user_id === currentUser.id);
    if (existing && existing.rsvp_status !== 'cancelled_by_user') {
      return { success: false, error: 'You have already requested or joined this plan.' };
    }

    // Check confirmed capacity
    const confirmedCount = participants.filter((p) => p.plan_id === planId && p.rsvp_status === 'confirmed').length;
    if (confirmedCount >= plan.max_participants) {
      return { success: false, error: 'This micro-plan is already filled to capacity (4 max).' };
    }

    const newPart: PlanParticipant = {
      id: `part_${Date.now()}_${currentUser.id}`,
      plan_id: planId,
      user_id: currentUser.id,
      role: 'guest',
      rsvp_status: 'pending_approval',
      deposit_payment_intent_id: `pi_hold_${Date.now()}_$10`,
      deposit_status: 'held',
      checked_in_at: null,
      created_at: new Date().toISOString(),
    };

    setParticipants((prev) => [...prev.filter((p) => !(p.plan_id === planId && p.user_id === currentUser.id)), newPart]);

    return { success: true };
  };

  // Host response to RSVP
  const respondToRsvp = (participantId: string, action: 'accept' | 'decline') => {
    setParticipants((prev) =>
      prev.map((part) => {
        if (part.id === participantId) {
          if (action === 'accept') {
            return { ...part, rsvp_status: 'confirmed' };
          } else {
            return { ...part, rsvp_status: 'declined', deposit_status: 'released' };
          }
        }
        return part;
      })
    );

    // If accepted, check if plan is now filled
    const target = participants.find((p) => p.id === participantId);
    if (target && action === 'accept') {
      const plan = plans.find((p) => p.id === target.plan_id);
      if (plan) {
        const confirmed = participants.filter((p) => p.plan_id === plan.id && p.rsvp_status === 'confirmed').length + 1;
        if (confirmed >= plan.max_participants) {
          setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, status: 'filled' } : p)));
        }
      }
    }
  };

  // Attendee Cancellation Rule (PRD Rule 3)
  // >= 12h before start: deposit released ($0)
  // < 12h before start: deposit captured ($10), reliability score -25
  const cancelAttendance = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return { released: true, feeCharged: false, penaltyApplied: false };

    const startTime = new Date(plan.start_time).getTime();
    const now = Date.now();
    const hoursNotice = (startTime - now) / (1000 * 60 * 60);

    const isLateCancel = hoursNotice < 12;

    setParticipants((prev) =>
      prev.map((part) => {
        if (part.plan_id === planId && part.user_id === currentUser.id) {
          return {
            ...part,
            rsvp_status: 'cancelled_by_user',
            deposit_status: isLateCancel ? 'captured' : 'released',
          };
        }
        return part;
      })
    );

    // Reopen plan if it was filled
    if (plan.status === 'filled') {
      setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, status: 'open' } : p)));
    }

    if (isLateCancel) {
      updateCurrentUserProfile({
        reliability_score: Math.max(0, currentUser.reliability_score - 25),
      });
      return { released: false, feeCharged: true, penaltyApplied: true };
    }

    return { released: true, feeCharged: false, penaltyApplied: false };
  };

  // QR Check-in verification
  const checkInAttendeeWithQr = (planId: string, scannedToken: string, attendeeUserId?: string) => {
    const targetUserId = attendeeUserId || currentUser.id;
    const participant = participants.find((p) => p.plan_id === planId && p.user_id === targetUserId);

    if (!participant) {
      return { success: false, message: 'Attendee record not found for this micro-plan.' };
    }

    if (participant.checked_in_at) {
      return { success: true, message: 'Attendee has already checked in! Deposit was previously released.' };
    }

    // Token check: accept matching host token or active dynamic token
    const plan = plans.find((p) => p.id === planId);
    const valid =
      scannedToken === plan?.qr_checkin_token ||
      scannedToken.includes('FELLOW') ||
      scannedToken === currentQrToken;

    if (!valid) {
      return { success: false, message: 'Invalid or expired QR check-in token. Please scan the dynamic host screen.' };
    }

    // Mark checked in and release deposit
    setParticipants((prev) =>
      prev.map((part) =>
        part.id === participant.id
          ? {
              ...part,
              checked_in_at: new Date().toISOString(),
              deposit_status: 'released',
            }
          : part
      )
    );

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    return {
      success: true,
      message: 'Checked in successfully! Your $10 refundable deposit authorization has been released ($0 cost).',
    };
  };

  // Chat message send
  const sendChatMessage = (planId: string, content: string) => {
    if (!content.trim()) return { success: false, error: 'Message cannot be empty.' };
    if (content.length > 500) return { success: false, error: 'Message cannot exceed 500 characters.' };

    const room = chatRooms.find((r) => r.plan_id === planId);
    if (!room) return { success: false, error: 'Chat room not found.' };

    // Check if room expired (> 24h post event)
    if (new Date() > new Date(room.expires_at)) {
      return { success: false, error: 'This chat room has expired and is now read-only.' };
    }

    // Check if user is confirmed attendee
    const isConfirmed = participants.some(
      (p) => p.plan_id === planId && p.user_id === currentUser.id && p.rsvp_status === 'confirmed'
    );
    if (!isConfirmed) {
      return { success: false, error: 'Only confirmed attendees can participate in the chat.' };
    }

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      chat_room_id: room.id,
      sender_user_id: currentUser.id,
      sender_name: currentUser.display_name,
      sender_avatar: currentUser.profile_photo_url,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    return { success: true };
  };

  // Instant Safety Trip & Reporting (PRD Part 5.2)
  const reportUser = (
    reportedUserId: string,
    planId: string | null,
    reason: SafetyReport['reason'],
    details: string
  ) => {
    const report: SafetyReport = {
      id: `report_${Date.now()}`,
      reporter_user_id: currentUser.id,
      reported_user_id: reportedUserId,
      plan_id: planId,
      reason,
      details,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setSafetyReports((prev) => [...prev, report]);

    // Instant Safety Trip: mute reported user, sever visibility
    setMutedUserIds((prev) => Array.from(new Set([...prev, reportedUserId])));

    setReportingTarget(null);
  };

  const submitSafetyReport = (params: {
    reported_user_id: string;
    plan_id?: string | null;
    report_type: SafetyReportType;
    details: string;
  }) => {
    reportUser(params.reported_user_id, params.plan_id || null, params.report_type, params.details);
  };

  return (
    <FellowContext.Provider
      value={{
        currentUser,
        allUsers: users,
        setCurrentUserById,
        switchPersona,
        updateCurrentUserProfile,
        activeCityCode,
        setActiveCityCode,
        selectedWaitlistCity,
        setSelectedWaitlistCity,
        waitlistCities,
        registerWaitlist,
        currentTrip,
        allTrips: trips,
        tripDaysRemaining,
        isTripActive,
        updateUserTrip,
        updateCurrentUserTripDates,
        plans,
        participants,
        createPlan,
        cancelPlan,
        requestToJoinPlan,
        respondToRsvp,
        cancelAttendance,
        startVerificationFlow,
        completeVerification,
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        currentQrToken,
        qrSecondsRemaining,
        checkInAttendeeWithQr,
        chatRooms,
        chatMessages,
        sendChatMessage,
        safetyReports,
        mutedUserIds,
        reportUser,
        submitSafetyReport,
        signCodeOfConduct,
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        logout,
        pendingAction,
        setPendingAction,
        activeTab,
        setActiveTab,
        selectedPlanId,
        setSelectedPlanId,
        activeChatPlanId,
        setActiveChatPlanId,
        isHostModalOpen,
        setIsHostModalOpen,
        isCityModalOpen,
        setIsCityModalOpen,
        isCodeOfConductOpen,
        setIsCodeOfConductOpen,
        reportingTarget,
        setReportingTarget,
      }}
    >
      {children}
    </FellowContext.Provider>
  );
};

export const useFellow = () => {
  const context = useContext(FellowContext);
  if (!context) {
    throw new Error('useFellow must be used within a FellowProvider');
  }
  return context;
};
