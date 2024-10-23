import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const addPlace = async (place) => {
  try {
    await addDoc(collection(db, "places"), place);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getPlaces = async () => {
  const querySnapshot = await getDocs(collection(db, "places"));
  const places = [];
  querySnapshot.forEach((doc) => {
    places.push({ id: doc.id, ...doc.data() });
  });
  return places;
};

export { addPlace, getPlaces };
