class TempStorage {
    constructor(){
 this.users= new Map();
    };
     saveRegistration(email, userData){
      try{
        this.users.set(email,userData);
        return true
      }catch(erro){
         return false
      }
     
     
      };
      /**
       * @param {string} email
       * @return {object} 
       */
  getRegistration(email) {
    const data = this.users.get(email);

    if (!data) {
      return null;
    }
    return data ;
}
deleteRegistration(email){
  this.users.delete(email);
}




}

module.exports = new TempStorage();