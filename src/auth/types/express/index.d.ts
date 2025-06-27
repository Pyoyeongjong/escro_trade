import { UserPayload } from "../auth.userpayload";

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export { }