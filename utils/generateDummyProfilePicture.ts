import { faker } from "@faker-js/faker";

export const generateDummyProfilePicture = () => {
  const randomImg = faker.image.avatarGitHub();
  return randomImg;
};
