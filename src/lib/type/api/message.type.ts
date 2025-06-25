export type MessageBody = {
  template_id: string;
  destinations: {
    phone_number: string;
    list_param: Record<string, string>;
  }[];
};

export type MessageResponse = {
  message: string;
  message_id?: string;
};
