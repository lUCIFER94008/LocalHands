import { NextResponse } from 'next/server';
import { getCurrentUser } from './auth';

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, error: { message: 'Unauthorized. Please log in.' } },
        { status: 401 }
      ),
      user: null,
    };
  }
  return { error: null, user };
}

export async function requireRole(allowedRoles = []) {
  const { error, user } = await requireAuth();
  if (error) return { error, user: null };

  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!rolesArray.includes(user.role)) {
    return {
      error: NextResponse.json(
        { success: false, error: { message: 'Forbidden. Access denied for your role.' } },
        { status: 403 }
      ),
      user: null,
    };
  }

  // Extra check for providers: must be approved to access provider features
  if (user.role === 'provider' && rolesArray.includes('provider')) {
    if (!user.provider) {
      return {
        error: NextResponse.json(
          { success: false, error: { message: 'Provider profile not found.' } },
          { status: 404 }
        ),
        user: null,
      };
    }
    if (user.provider.approvalStatus !== 'approved' || !user.provider.isApproved) {
      return {
        error: NextResponse.json(
          {
            success: false,
            error: {
              message: `Provider account status is '${user.provider.approvalStatus}'. Approval required.`,
              approvalStatus: user.provider.approvalStatus,
            },
          },
          { status: 403 }
        ),
        user: null,
      };
    }
  }

  return { error: null, user };
}

export function checkOwnership(resourceUserId, currentUserId) {
  return resourceUserId?.toString() === currentUserId?.toString();
}
