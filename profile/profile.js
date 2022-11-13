// init firestore
const db = firebase.firestore();


// complete user class model in vanilla js with name, email, password, company and avatar
class User {
  constructor(name, email, password, company, avatar) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.company = company;
    this.avatar = avatar;
  }

    // method to get user data from firestore  
  getUserData() {
    // get user data from firestore
    db.collection("users")
      .doc(this.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // set user data to the user class  
        }})}
}