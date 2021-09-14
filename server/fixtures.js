import { Meteor } from 'meteor/meteor';
import { CategoriesCollection } from '/imports/api/categories';
import { CompanyInfoCollection } from '/imports/api/companyInfo';
import { InventoriesCollection } from '/imports/api/inventories';
import { ProductsCollection } from '/imports/api/products';
import { QualityCollection } from '/imports/api/quality';

const productsBase = [
  {name: 'Boligrafo', img: '/img/products/boligrafo.jpg', points: 5,},
  {name: 'Lonchera', img: '/img/products/lonchera.jpg', points: 15,},
  {name: 'Libreta', img: '/img/products/libreta.jpg', points: 20,},
  {name: 'Botella de agua', img: '/img/products/botella.jpg', points: 20,},
  {name: 'Termo', img: '/img/products/termo.jpg', points: 30,},
  {name: 'Cupón Little Caesars Pizza', img: '/img/products/cupon.jpg', points: 40,},
  {name: 'Gorra', img: '/img/products/gorra.jpg', points: 40,},
  {name: 'Sombrilla', img: '/img/products/sombrilla.jpg', points: 50,},
  {name: 'Mochila', img: '/img/products/mochila.jpg', points: 60,},
  {name: 'Playera', img: '/img/products/playera.jpg', points: 65,},
  {name: 'Chaleco', img: '/img/products/chaleco.jpg', points: 150,},
  {name: 'Sudadera', img: '/img/products/sudadera.jpg', points: 150,},
  {name: 'VISA', img: '/img/products/visa.jpg', points: 450,},
  {name: 'Televisor', img: '/img/products/tv.jpg', points: 500,},
];

Meteor.startup(() => {
  // Agregar super usuario
  if (Meteor.users.find().count() === 0) {

    const adminId = Accounts.createUser({
      username: 'admin',
      password: 'Password1',
      profile: {
        name: 'Admin',
        lastName: '',
        image: '',
        enable: true,
      }
    });
  
    Roles.createRole('superadmin', { unlessExists: true });
    Roles.addUsersToRoles(adminId, [ 'superadmin' ]);

    console.log('Admin user created: ', adminId);

    const userExample = Accounts.createUser({
      username: '123',
      password: 'Password1',
      profile: {
        name: 'User',
        lastName: '',
        image: '',
        enable: true,
        numberEmployee: 123
      }
    });

    Roles.createRole('user', { unlessExists: true });
    Roles.addUsersToRoles(userExample, [ 'user' ]);

    console.log('User created: ', userExample);
  };

  if (CategoriesCollection.find().count() === 0) {
    CategoriesCollection.insert({ name: 'General' });
    CategoriesCollection.insert({ name: 'Otros' });
  }

  if (CompanyInfoCollection.find().count() === 0) {

    const data = {
      name: 'MeritMedical',
      address: '',
      phone: '',
      image: ''
    };
  
    CompanyInfoCollection.insert(data);
  }

  if (QualityCollection.find().count() === 0) {
    QualityCollection.insert({
      name: 'Compromiso',
      enable: true,
      color: '#7e3f98',
      behaviors: [
        {name: 'Cumplo con mis compromisos a tiempo'},
        {name: 'Soy profesional, responsable y leal'},
        {name: 'Realizo con pasión mi trabajo para lograr un producto con un alto estándar de calidad'},
        {name: 'Busco constantemente la innovación y Mejora Continua'},
        {name: 'Comprendo el impacto de mi contribución en los resultados de la compañía'}
      ]
    });

    QualityCollection.insert({
      name: 'Seguridad',
      enable: true,
      color: '#bf202f',
      behaviors: [
        {name: 'Soy responsable y entiendo que mi seguridad es primero'},
        {name: 'Reporto y elimino condiciones inseguras que identifico'},
        {name: 'Prevengo condiciones de riesgo'},
        {name: 'No cometo actos inseguros'},
        {name: 'Aprendo de incidentes previos, actos inseguros y participo en la solución de estos'},
        {name: 'Cuido de mis compañeros y de mi entorno como cuido de mí mismo'},
        {name: 'Participo activamente en las actividades relacionadas a entrenamientos, brigadas y cómite de seguridad'}
      ]
    });

    QualityCollection.insert({
      name: 'Responsabilidad',
      enable: true,
      color: '#f1582d',
      behaviors: [
        {name: 'Me comprometo a mantener mi persona y área segura'},
        {name: 'No acepto, no hago y no paso defectos'},
        {name: 'Participo creativamente en la solución de problemas'},
        {name: "Aplico las 5'S en mi lugar de trabajo, siempre buscando la perfección"}
      ]
    });

    QualityCollection.insert({
      name: 'Respeto',
      enable: true,
      color: '#18a750',
      behaviors: [
        {name: 'Acepto la diversidad para mi crecimiento personal y profesional'},
        {name: 'Muestro interés genuino en el bienestar de los demás y trato a mis compañeros con dignidad'},
        {name: 'Valoro el trabajo e ideas de todos'},
        {name: 'Busco mi desarrollo y fomento el crecimiento de mi equipo de trabajo'}
      ]
    });

    QualityCollection.insert({
      name: 'Honestidad',
      enable: true,
      color: '#20a9e1',
      behaviors: [
        {name: 'Cuido las instalaciones y respeto las pertenencias de los demás'},
        {name: 'Me comporto con integridad con mis compañeros y hacia la compañía'},
        {name: 'Reconozco mis erroes y acepto retroalimentación constructiva'}
      ]
    });

    QualityCollection.insert({
      name: 'Confianza',
      enable: true,
      color: '#f7b118',
      behaviors: [
        {name: 'Construyo confianza entregando resultados, apegándome a los valores Merit'},
        {name: 'Soy empático al interactuar con los demás y entiendo que mi cuerpo también comunica'},
        {name: 'Me preparo para enfrentar nuevos retos'},
        {name: 'Me enfoco en los sistemas y en la solución de problemas, no en las personas'},
        {name: 'Soy respetuoso con todos y asumo mi responsabilidad'},
        {name: 'Cuando delego actividades lo hago responsablemente'}
      ]
    });
  }

  if (ProductsCollection.find().count() === 0) {
    productsBase.map(product => {
      let newProduct = product;
      newProduct.enable = true;
      const dataProduct = ProductsCollection.insert(newProduct);

      const data = {
        product: dataProduct,
        pieces: 0,
        movements: [],
        orders: [],
      }

      InventoriesCollection.insert(data);
    })
  }
});
