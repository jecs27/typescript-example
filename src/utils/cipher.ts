import bcrypt from 'bcrypt';

export const caesarCipher = (text: string, shift: number = 9): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let value = text;
  if (value.length < 9) {
    const randomChars = Array.from({ length: 9 - value.length }, () => {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      return alphabet[randomIndex];
    });
    value += randomChars.join('');
  }
  const strValue = value.split('');
  strValue.sort(() => Math.random() - 0.5);
  value = strValue.join('');

  return value
    .replace(/ /g, '')
    .toLowerCase()
    .split('')
    .map((char) => {
      if (Math.random() < 0.5) {
        return char.toUpperCase();
      }
      return char;
    })
    .map((char) => {
      if (alphabet.includes(char)) {
        const newIndex = (alphabet.indexOf(char) + shift) % alphabet.length;
        return alphabet[newIndex];
      } else {
        return char;
      }
    })
    .join('');
};

export const hashPassword = (password: string) => {
  const saltRounds = 9;
  return bcrypt.hash(password, saltRounds);
};

export const validatePassword = (password: string, passwordHashed: string) => {
  return bcrypt.compare(password, passwordHashed);
};
