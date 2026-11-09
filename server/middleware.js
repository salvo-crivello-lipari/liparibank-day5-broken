module.exports = (req, res, next) => {
  const delay = Math.floor(Math.random() * 1200) + 300;

  setTimeout(() => {
    if (req.path === '/accounts/acc-999') {
      return res.status(404).json({ message: 'Conto non trovato' });
    }
    next();
  }, delay);
};
