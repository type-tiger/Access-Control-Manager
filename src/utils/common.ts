export const createNewId = () => {
  return `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
