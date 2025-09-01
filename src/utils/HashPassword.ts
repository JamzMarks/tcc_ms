import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;
export async function hashPassword(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, saltOrRounds); 
    return hashPassword;
}