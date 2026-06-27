// server/middleware/role.js

/**
 * Role-based access control middleware
 * Can be called either as:
 *   - roleMiddleware(['admin', 'super_admin']) (original style)
 *   - requireRole('admin', 'super_admin') (spread style)
 */
const requireRole = (...roles) => {
  // If the first argument is an array, extract it (backward compatibility)
  const allowedRoles = Array.isArray(roles[0]) ? roles[0] : roles;

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autentikasi diperlukan.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Akses ditolak. Anda tidak memiliki hak akses yang diperlukan.'
      });
    }

    next();
  };
};

module.exports = requireRole;
