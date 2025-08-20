import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import * as authController from '../controllers/authController';

const router = Router();

// ===== ROTAS PÚBLICAS =====
/**
 * @route POST /api/auth/register
 * @desc Registro de novo usuário
 * @access Public
 */
router.post('/register', asyncHandler(authController.register));

/**
 * @route POST /api/auth/login
 * @desc Login do usuário
 * @access Public
 */
router.post('/login', asyncHandler(authController.login));

/**
 * @route POST /api/auth/refresh
 * @desc Renovar token JWT
 * @access Public (com refresh token)
 */
router.post('/refresh', asyncHandler(authController.refreshToken));

/**
 * @route POST /api/auth/forgot-password
 * @desc Solicitar reset de senha
 * @access Public
 */
router.post('/forgot-password', asyncHandler(authController.forgotPassword));

/**
 * @route POST /api/auth/reset-password
 * @desc Resetar senha com token
 * @access Public
 */
router.post('/reset-password', asyncHandler(authController.resetPassword));

// ===== ROTAS AUTENTICADAS =====
/**
 * @route GET /api/auth/me
 * @desc Dados do usuário logado
 * @access Private
 */
router.get('/me', authenticateToken, asyncHandler(authController.getMe));

/**
 * @route PUT /api/auth/me
 * @desc Atualizar dados do usuário logado
 * @access Private
 */
router.put('/me', authenticateToken, asyncHandler(authController.updateMe));

/**
 * @route PUT /api/auth/password
 * @desc Alterar senha do usuário logado
 * @access Private
 */
router.put('/password', authenticateToken, asyncHandler(authController.changePassword));

/**
 * @route POST /api/auth/logout
 * @desc Logout do usuário
 * @access Private
 */
router.post('/logout', authenticateToken, asyncHandler(authController.logout));

/**
 * @route GET /api/auth/verify
 * @desc Verificar se token é válido
 * @access Private
 */
router.get('/verify', authenticateToken, asyncHandler(authController.verifyToken));

export default router;