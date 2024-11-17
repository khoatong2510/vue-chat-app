import { DbContext, UserContext } from "../lambda/types";
import { ID } from "./types";

const getConversation = (dbContext: DbContext, userContext: UserContext) => async (conversationId: ID) => {

}

export default {
  getConversation
}