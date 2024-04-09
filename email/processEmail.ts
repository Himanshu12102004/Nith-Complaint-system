const processEmail = (
  html: string,
  text: string,
  options: { otp: string; name: string; designation: string }
) => {
  const { otp, name, designation } = options;
  html
    .replace('${otp}', otp)
    .replace('${name}', name)
    .replace('${designation}', designation);
  text.replace('${otp}', otp);
};
