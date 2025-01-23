export interface Message {
  id: string;
  msgId: string,
  msg: string;
  senderId: string;
  receiverId: string;
  image: string;
  name: string;
}

export interface ChatMessageType {
  id?: string;
  msg: string;
  senderId: string;
  receiverId: string;
  createdAt?: Date
}

export interface DropdownType {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    name: string;
    image: string;
  };
}

export interface ChatListTypes {
  id: string,
  name: string,
  image: string,
  email?: string
}