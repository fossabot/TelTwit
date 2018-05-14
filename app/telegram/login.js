import { inputField } from './fixtures';
import { telegram, app } from './init';
import {settings, api} from '../config/telegram';


async function login(){
  
  console.log("Logging in to Telegram");
  console.log("Phone: ", settings.phone);

  try {

    /**
     * Request the Auth code
     */
    const { phone_code_hash, phone_registered } = await telegram('auth.sendCode', {
      phone_number    : settings.phone,
      current_number  : false,
      api_id          : api.api_id,
      sms_type        : 5,
      api_hash        : settings.api_hash
    });

    const code = await inputField('code');


    if ( ! phone_registered) {

      console.log("User not found, registering new user from config details");

      const {user} = await telegram('auth.signUp', {
        phone_number    : settings.phone,
        phone_code_hash : phone_code_hash,
        phone_code      : code,
        first_name      : settings.firstName,
        last_name       : settings.lastName
      });

    } else {

      const {user} = await telegram('auth.signIn', {
        phone_number      : settings.phone,
        phone_code_hash   : phone_code_hash,
        phone_code        : code
      });

    }

    console.log('signed as ', user)

  } catch ( error ) {

    console.log("Telegram Login", error);

  }

}

module.exports = login;