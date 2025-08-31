import man from "../assets/man-avatar.png";
import hat_man from "../assets/man-with-hat.png";

export const sampleChats = [
  {
    avatar: [hat_man],
    name: "John Doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2", "3"],
  },
  {
    avatar: [man],
    name: "John Boi",
    _id: "2",
    groupChat: false,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: [hat_man],
    name: "John Doe",
    _id: "1",
  },
  {
    avatar: [man],
    name: "John Boi",
    _id: "2",
  },
];

export const sampleNotification = [
  {
    sender: {
      avatar: [hat_man],
      name: "John Doe",
    },
    _id: "1",
  },
  {
    sender: {
      avatar: [man],
      name: "John Boi",
    },
    _id: "2",
  },
];

export const sampleMessages = [
  {
    attachments: [],
    content: "hey dear, How are you...",
    _id: "sogfdsoghosdhgdshg",
    sender: {
      _id: "user._id",
      name: "Chaman",
    },
    chat: "chatId",
    createdAt: "2022-08-08T00:00:00.000Z",
  },
  {
    attachments: [
      {
        public_id: "asdaddddfdd2",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "",
    _id: "sogfdsvxcvxoghosdhgdshg",
    sender: {
      _id: "dfdsafsdfas",
      name: "Chaman2",
    },
    chat: "chatId",
    createdAt: "2022-08-08T00:00:00.000Z",
  },
];

export const dashboardData = {
  users: [
    {
      name: "John Doe",
      avatar: [man],
      _id: "1",
      username: "john_doe",
      friends: 20,
      groups: 5,
    },
    {
      name: "John Boi",
      avatar: [man],
      _id: "2",
      username: "john_boi",
      friends: 20,
      groups: 25,
    },
  ],

  chats: [
    {
      name: "canvas Group",
      avatar: [man],
      _id: "1",
      groupChat: false,
      members: [{_id:"1",avatar:man},{_id:"2",avatar:man}],
      totalMembers: 3,
      totalMessages: 5,
      creator: {
        name: "John Doe",
        avatar: [man],
      },
    },
    {
      name: "grok Group",
      avatar: [man],
      _id: "2",
      groupChat: true,
      members: [{_id:"1",avatar:man},{_id:"2",avatar:man}],
      totalMembers: 3,
      totalMessages: 5,
      creator: {
        name: "John Boi",
        avatar: [man],
      },
    },
  ],

  messages:[
    {
      attachments: [],
      content: "hey dear, How are you...",
      _id: "sogfdsoghosdhgdshg",
      sender: {
        avatar:man,
        name: "Chaman",
      },
      chat: "chatId",
      groupChat: false,
      createdAt: "2022-08-08T00:00:00.000Z",
    },
    {
      attachments: [
        {
          public_id: "asdaddddfdd2",
          url: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],
      content: "",
      _id: "sogfdsvxcvxoghosdhgdshg",
      sender: {
        avatar:man,
        name: "Chaman2",
      },
      chat: "chatId",
      groupChat: true,
      createdAt: "2022-08-08T00:00:00.000Z",
    },
  ]
};
