import { ApiResponse } from "@type/api.type";
import { MessageBody, MessageResponse } from "@type/api/message.type";
import { apiPost } from "@utils/config-api";
import { Request } from "@type/api.type";

const DOMAIN = "https://eb4e-2405-4802-9407-89d0-9ece-9dcd-e668-f33a.ngrok-free.app/api";
const PATH_MESSAGE = "/sns/messages";
/**
 * Api create message
 * @param body MessageBody
 * @returns ApiResponse<MessageResponse>
 */
export const apiCreateMessage = async (body: MessageBody) => {
  const request: Request = {
	token: "",
	url: `${DOMAIN}${PATH_MESSAGE}`,
	body: JSON.stringify(body),
  };

  return await apiPost<ApiResponse<MessageResponse>>(request);
};


