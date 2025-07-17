import { JWTPayload } from "jose";

export interface payloadJwt extends JWTPayload{
    userId: string;
    ehAdmin: boolean;
}