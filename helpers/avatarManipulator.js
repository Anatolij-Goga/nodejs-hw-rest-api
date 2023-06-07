const Jimp = require("jimp");

const avatarManipulator = async (avatarPath) => {
  try {
    const image = await Jimp.read(avatarPath);
    const resizedImage = image.resize(250, 250).quality(60);

    await resizedImage.writeAsync(avatarPath);
  } catch (error) {
    console.log("Error: ", error.message);
    throw error;
  }
};

module.exports = avatarManipulator;
