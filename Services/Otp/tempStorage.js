const crypto = require("crypto");

class TempStorage {
  /**
   * Default expiration time (10 minutes)
   */
  durationMs = 10 * 60 * 1000;

  constructor() {
    this.store = new Map();
    this.timers = new Map();
  }

 /**
 * Generate and store an OTP for a specific key.
 *
 * If the user already has an active OTP, the old expiration
 * timer is cleared before creating a new one.
 *
 * @param {string} key - Unique identifier (email, phone, etc.)
 * @param {number} durationMs - OTP lifetime in milliseconds
 * @returns {number} Generated 6-digit OTP
 */
create(key, durationMs = this.durationMs) {

  // If an OTP already exists for this key,
  // cancel its expiration timer.
  if (this.timers.has(key)) {
    clearTimeout(this.timers.get(key));
  }

  // Generate a secure 6-digit OTP.
  const otp = crypto.randomInt(100000, 1000000);

  // Store the OTP using the key as an identifier.
  this.store.set(key, otp);

  // Create a timer that automatically removes
  // the OTP after the specified duration.
  const timer = setTimeout(() => {

    // Remove the expired OTP.
    this.store.delete(key);

    // Remove the timer reference.
    this.timers.delete(key);

  }, durationMs);

  // Store the timer reference so it can be
  // cancelled if a new OTP is requested.
  this.timers.set(key, timer);

  // Return the generated OTP.
  return otp;
}
/**
 * 
 * @param {string} key 
 * @param {number} enteredOtp 
 * @returns {boolean}
 */
  verify(key, enteredOtp) {
    const savedOtp = this.store.get(key);
    console.log(savedOtp);

    if (!savedOtp) {
      return {success:false,message:"faild, otp not  saved"};
    }

    if (savedOtp !== Number(enteredOtp)) {
      return {success:false,message:"faild, incorrect opt "};
    }

    this.store.delete(key);

    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }

    return {success:true,message:"operation complited successfully"};
  }
}

module.exports = new TempStorage();