import bcrypt from 'bcrypt';

const checkPasswords = async (
  enteredPassword: string,
  databasePassword: string
): Promise<boolean> => {
  try {
    const isMatch: boolean = await bcrypt.compare(
      enteredPassword,
      databasePassword
    );
    return isMatch;
  } catch (err) {
    throw err;
  }
};

export { checkPasswords };

const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw err;
  }
};

export { hashPassword };
