const avatarUrl = avatar => {
  if (!avatar) return '/images/user.png';
  else if (avatar.slice(0, 4) === 'http') return avatar;
  else return `https://res.cloudinary.com/miladdarren/image/upload/${avatar}`;
};

export { avatarUrl };
