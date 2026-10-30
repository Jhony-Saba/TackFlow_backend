class TempStorage {
    constructor(){
 this.users= new Map();
    };
     saveRegistration(email, userData){
      try{
        this.users.set(email,userData);
       
        return {success:true, message: "email was saved"}
      }catch(error){
         return {success:true, message: error}
      }
    
     
  };
      /**
       * @param {string} email
       
       */
  getRegistration(email) {
   
    const data = this.users.get(email);
      console.log(data); 
    if (!data) {
      return {success: false ,message:"not found this user"};
    }
    return {success:true,Data:data} ;
}



deleteRegistration(email){
  this.users.delete(email);
}




}

module.exports = new TempStorage();