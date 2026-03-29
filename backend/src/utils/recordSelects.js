export const professionalMiniSelect = {
  id: true,
  discipline: true,
  calendarColor: true,
  user: {
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
    },
  },
}

export const serviceMiniSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  durationMinutes: true,
  colorTag: true,
}

export const familyMiniSelect = {
  id: true,
  displayName: true,
  primaryContactName: true,
  phone: true,
  email: true,
  status: true,
}

export const childMiniSelect = {
  id: true,
  firstName: true,
  lastName: true,
  birthDate: true,
  status: true,
  family: {
    select: familyMiniSelect,
  },
}

export const userSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  status: true,
  phone: true,
  lastLoginAt: true,
  createdAt: true,
  professionalProfile: {
    select: {
      id: true,
      discipline: true,
      calendarColor: true,
      isHighlighted: true,
    },
  },
}

export const messagingUserSelect = {
  id: true,
  fullName: true,
  role: true,
  status: true,
  professionalProfile: {
    select: {
      id: true,
      discipline: true,
    },
  },
}

export const professionalSelect = {
  ...professionalMiniSelect,
  bio: true,
  isHighlighted: true,
  createdAt: true,
  updatedAt: true,
}

export const serviceSelect = {
  ...serviceMiniSelect,
  createdAt: true,
  updatedAt: true,
}

export const familySelect = {
  ...familyMiniSelect,
  primaryContactRelationship: true,
  address: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  children: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      status: true,
    },
  },
}

export const childSelect = {
  id: true,
  firstName: true,
  lastName: true,
  birthDate: true,
  schoolName: true,
  notes: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  family: {
    select: familyMiniSelect,
  },
  assignments: {
    select: {
      id: true,
      notes: true,
      service: {
        select: serviceMiniSelect,
      },
      professional: {
        select: professionalMiniSelect,
      },
    },
  },
}

export const sessionSelect = {
  id: true,
  startsAt: true,
  endsAt: true,
  status: true,
  adminNotes: true,
  internalNotes: true,
  createdAt: true,
  child: {
    select: childMiniSelect,
  },
  service: {
    select: serviceMiniSelect,
  },
  professional: {
    select: professionalMiniSelect,
  },
  attendance: {
    select: {
      id: true,
      status: true,
      notes: true,
      registeredAt: true,
    },
  },
}

export const followUpSelect = {
  id: true,
  childId: true,
  professionalId: true,
  authorUserId: true,
  sessionId: true,
  followUpDate: true,
  title: true,
  summary: true,
  note: true,
  createdAt: true,
  child: {
    select: childMiniSelect,
  },
  session: {
    select: {
      id: true,
      startsAt: true,
      status: true,
    },
  },
  professional: {
    select: professionalMiniSelect,
  },
  authorUser: {
    select: {
      id: true,
      fullName: true,
      role: true,
    },
  },
}

export const paymentSelect = {
  id: true,
  amount: true,
  status: true,
  paidAt: true,
  dueDate: true,
  notes: true,
  createdAt: true,
  child: {
    select: childMiniSelect,
  },
  family: {
    select: familyMiniSelect,
  },
  session: {
    select: {
      id: true,
      startsAt: true,
      status: true,
    },
  },
}

export const attendanceSelect = {
  id: true,
  status: true,
  notes: true,
  registeredAt: true,
  session: {
    select: sessionSelect,
  },
}

export const contactInquirySelect = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  message: true,
  status: true,
  createdAt: true,
}

const messageSelect = {
  id: true,
  body: true,
  createdAt: true,
  authorUser: {
    select: messagingUserSelect,
  },
}

const messageThreadBaseSelect = {
  id: true,
  contextType: true,
  subject: true,
  status: true,
  priority: true,
  createdAt: true,
  updatedAt: true,
  child: {
    select: childMiniSelect,
  },
  createdByUser: {
    select: messagingUserSelect,
  },
  participants: {
    select: {
      id: true,
      lastReadAt: true,
      createdAt: true,
      user: {
        select: messagingUserSelect,
      },
    },
  },
}

export const messageThreadSummarySelect = (userId) => ({
  ...messageThreadBaseSelect,
  messages: {
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
    select: messageSelect,
  },
  notifications: {
    where: {
      userId,
      readAt: null,
    },
    select: {
      id: true,
    },
  },
})

export const messageThreadDetailSelect = (userId) => ({
  ...messageThreadBaseSelect,
  messages: {
    orderBy: {
      createdAt: 'asc',
    },
    select: messageSelect,
  },
  notifications: {
    where: {
      userId,
      readAt: null,
    },
    select: {
      id: true,
    },
  },
})

export const notificationSelect = {
  id: true,
  type: true,
  title: true,
  bodyPreview: true,
  threadId: true,
  childId: true,
  readAt: true,
  createdAt: true,
  actorUser: {
    select: messagingUserSelect,
  },
  child: {
    select: childMiniSelect,
  },
  thread: {
    select: {
      id: true,
      subject: true,
      priority: true,
      status: true,
    },
  },
}
