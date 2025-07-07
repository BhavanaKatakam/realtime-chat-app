import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosIns } from "../lib/axios";
import { userAuthStore } from "./userAuthStore";

export const userChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosIns.get("/msg/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosIns.get(`/msg/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    try {
      const res = await axiosIns.post(`/msg/send/${selectedUser._id}`, messageData);
      get().addMessage(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  addMessage: (newMsg) => {
    const { messages } = get();
    set({ messages: [...messages, newMsg] });
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = userAuthStore.getState().socket;
    if (!socket || !socket.connected) return;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      get().addMessage(newMessage);
    });
  },

  unsubscribeFromMessages: () => {
    const socket = userAuthStore.getState().socket;
    if (socket && socket.connected) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (user) => {
    get().unsubscribeFromMessages();
    set({ selectedUser: user, messages: [] });
    get().getMessages(user._id);
    get().subscribeToMessages();
  },
}));
