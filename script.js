const { createApp, ref, onMounted } = Vue;
const { createVuetify } = Vuetify;
const vuetify = createVuetify();

const app = createApp({
  setup() {
    let   response;
    const country       =ref([""]);
    const countrylist   =ref([]); 
    const num           =ref(0);
    const countries     =ref();
    const flag          =ref();
    const nation        =ref();
    const capitallist   =ref([]);
    const capitallists  =ref();
    const population    =ref();
    const lat           =ref();
    const lng           =ref();
    const mapContainer  =ref(null);
    const map           =ref();
    const marker        =ref();
 //   const targetlang    =ref(`ja`);
    const apikey        =ref("");
//  const apikey2       =ref("AIzaSyA6Gw7d_K62UTEoWYi10Z5Xgl6Y6z8HQn0")
    const region        =ref("japaneast");
    const endpoint      =ref("https://api.cognitive.microsofttranslator.com/")
//    const weather       =ref();
 
  
    // 関数はここ
      async function getCountry  () {
        while (num.value < 195){
         response = await
         axios.get("https://restcountries.com/v3.1/independent?status=true&fields=name");
         country.value = response.data[`${num.value}`].name.common;
         countrylist.value.push(country.value);
         num.value++;      
    }
        countrylist.value.sort();
   }
    
       function getMap  () {
        const map = new google.maps.Map(mapContainer.value, {
         center: { lat: 35.681236, lng: 139.767125}, 
         zoom: 14
        })

  const marker = new google.maps.Marker({
    position: { lat: 35.681236, lng:139.767125 },
    map: map,
    title: '東京駅'
})
}
    onMounted(() => {
            getCountry()
            getMap()
        });  
       
   async function translate (text) { 
     try{
     response =　await axios.post(`${endpoint.value}translate?api-version=3.0&from=en&to=ja`,[{Text: text}],{ 
　       headers:{
          "Ocp-Apim-Subscription-Key": apikey.value,
          "Ocp-Apim-Subscription-Region": region.value,
          "Content-Type": "application/json",
      },
     });
//     console.log(response.data);
     capitallists.value=response.data[0].translations[0].text
     console.log(capitallists.value);
     return capitallists.value
    }
    catch(error){
     console.error("Translation API Error:", error);
    }
    
 } 
   async function searchCountry () {
    const res1 = await axios.get(`https://restcountries.com/v3.1/name/${countries.value}`);
     console.log(res1.data)
     nation.value = res1.data[0].translations.jpn.official;
     capitallist.value = res1.data[0].capital;
     population.value = res1.data[0].population;
     population.value= population.value.toLocaleString();
     flag.value = res1.data[0].flags.png;
     lat.value = res1.data[0].latlng[0];
     lng.value = res1.data[0].latlng[1];
     const map= new google.maps.Map(mapContainer.value, {
     center: { lat: lat.value, lng: lng.value}, 
     zoom: 6})
     capitallists.value =await translate(capitallist.value[0]);    
  }  

    
 return {country,countrylist,searchCountry,countries,flag,nation,population,translate,capitallist,capitallists,map,mapContainer,getMap}
}
}).use(vuetify)
  .mount('#app'); // Vue が管理する一番外側の DOM 要素