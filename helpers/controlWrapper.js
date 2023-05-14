const controlWrapper = (control) => {
  const creatingWrapper = async (req, res, next) => {
    try {
      await control(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return creatingWrapper;
};

module.exports = controlWrapper;
