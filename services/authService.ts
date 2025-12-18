import { Amplify } from 'aws-amplify';
import { 
  signIn, 
  signUp, 
  confirmSignUp, 
  resendSignUpCode, 
  resetPassword, 
  confirmResetPassword, 
  signOut, 
  fetchUserAttributes,
  getCurrentUser as getAmplifyUser
} from 'aws-amplify/auth';
import { User } from '../types';
import { ADMIN_EMAIL } from '../constants';

/**
 * AWS COGNITO CONFIGURATION
 * Connected to Green Leaf Herbals User Pool
 */
const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_T2qB7n6By', 
      userPoolClientId: '10014e9s15qp3n3qld0ug2sf1h', 
      loginWith: {
        email: true
      }
    }
  }
};

Amplify.configure(awsConfig);

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { isSignedIn, nextStep } = await signIn({ username: email, password });
    
    if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
      throw new Error('Please confirm your email before logging in.');
    }

    const authUser = await getAmplifyUser();
    const attributes = await fetchUserAttributes();
    
    return {
      id: authUser.userId,
      name: attributes.name || 'User',
      email: attributes.email || email,
      // Check against the configured ADMIN_EMAIL
      role: (attributes.email === ADMIN_EMAIL) ? 'admin' : 'user',
      phone: attributes.phone_number,
      address: attributes['custom:address'],
      city: attributes['custom:city'],
      state: attributes['custom:state'],
      zip: attributes['custom:zip']
    };
  },

  async register(name: string, email: string, password: string) {
    return await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name
        }
      }
    });
  },

  async confirmRegister(email: string, code: string) {
    return await confirmSignUp({ username: email, confirmationCode: code });
  },

  async resendCode(email: string) {
    return await resendSignUpCode({ username: email });
  },

  async forgotPassword(email: string) {
    return await resetPassword({ username: email });
  },

  async confirmNewPassword(email: string, code: string, password: any) {
    return await confirmResetPassword({ 
      username: email, 
      confirmationCode: code, 
      newPassword: password 
    });
  },

  async logout() {
    await signOut();
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const authUser = await getAmplifyUser();
      const attributes = await fetchUserAttributes();
      return {
        id: authUser.userId,
        name: attributes.name || 'User',
        email: attributes.email || '',
        role: (attributes.email === ADMIN_EMAIL) ? 'admin' : 'user',
        phone: attributes.phone_number,
        address: attributes['custom:address'],
        city: attributes['custom:city'],
        state: attributes['custom:state'],
        zip: attributes['custom:zip']
      };
    } catch (err) {
      return null;
    }
  }
};