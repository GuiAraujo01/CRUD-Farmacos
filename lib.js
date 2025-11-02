const Farmacia = (() => {
  const STORAGE_KEY = "farmacia::farmacos";

  // ========================
  // Persistência
  // ========================
  //Lê os dados do localStorage, retornar array de fármacos ou vazio
  const loadFarmacos = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  };
  //Salve os dados no localstorage no formato json
  const saveFarmacos = (farmacos) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(farmacos));

  //Limpa o LocalStorage
  const clearFarmacos = () => localStorage.removeItem(STORAGE_KEY);
    
  // LISTA DE FÁRMACOS COM ESTRUTURA CORRETA
  const resetFarmacos = () => {
    const farmacos = [
        // CATEGORIAS ATUALIZADAS
        { id: 1, nome: "Dorflex", preco: 7.50, marca: "Sanofi", categoria: "Analgésico", principioAtivo: "Dipirona, Orfenadrina, Cafeína", dosagem: "300mg + 35mg + 50mg", qtdPorCaixa: "10 Comprimidos", quantidade: 85, imagemUrl: "https://sinete.com.br/media/mf_webp/png/media/catalog/product/cache/5b40fce2765566b85b6a8905e9b49538/d/o/dorflex_analg_sico_e_relaxante_muscular_10_comprimidos.webp" },
        { id: 2, nome: "Neosaldina", preco: 5.00, marca: "Takeda", categoria: "Analgésico", principioAtivo: "Dipirona, Mucato de Isometepteno, Cafeína", dosagem: "300mg + 30mg + 30mg", qtdPorCaixa: "4 Drágeas", quantidade: 120, imagemUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRyADC2uEeMfH0G3SN0-Rsk_LuubD6WV4IVavi0zD6SvSXO2ITRLiwK969xdxhrOh3hVdjR5bsfLHIXNw4Vr5ZpnCJvcEW5SfSzB17DTUDD2Ku9PHNgmr7bmQ" },
        { id: 3, nome: "Tylenol", preco: 18.90, marca: "Johnson & Johnson", categoria: "Analgésico", principioAtivo: "Paracetamol", dosagem: "750mg", qtdPorCaixa: "20 Comprimidos", quantidade: 60, imagemUrl: "https://www.drogarianovaesperanca.com.br/imagens/600x600/tylenol-750mg-com-20-comprimidos-3304345ac5.jpg" },
        { id: 4, nome: "Aspirina Prevent", preco: 25.00, marca: "Bayer", categoria: "Cardiovascular", principioAtivo: "Ácido Acetilsalicílico", dosagem: "100mg", qtdPorCaixa: "30 Comprimidos", quantidade: 45, imagemUrl: "https://sinete.com.br/pub/media/catalog/product/1/5/155548-800-auto.png" },
        { id: 5, nome: "Buscopan Composto", preco: 15.75, marca: "Boehringer Ingelheim", categoria: "Antiespasmódico", principioAtivo: "Butilbrometo de Escopolamina, Dipirona", dosagem: "10mg + 250mg", qtdPorCaixa: "20 Comprimidos", quantidade: 70, imagemUrl: "https://www.drogarianovaesperanca.com.br/imagens/600x600/buscopan-composto-10250mg-com-20-comprimidos-9dc1a272b4.jpg"},
        { id: 6, nome: "Advil", preco: 12.50, marca: "Pfizer", categoria: "Anti-inflamatório", principioAtivo: "Ibuprofeno", dosagem: "400mg", qtdPorCaixa: "8 Cápsulas", quantidade: 95, imagemUrl: "https://io.convertiez.com.br/m/farmaciasheroos/shop/products/images/66184/large/advil-400mg-8caps_60447.jpg" },
        { id: 7, nome: "Loratamed", preco: 9.90, marca: "Cimed", categoria: "Antialérgico", principioAtivo: "Loratadina", dosagem: "10mg", qtdPorCaixa: "12 Comprimidos", quantidade: 110, imagemUrl: "https://du3hj28fogfli.cloudfront.net/Custom/Content/Products/45/96/45968_loratamed-comprimido-10mg-caixa-com-12-comprimidos-p7896523202822_m1_637794011985486369.webp" },
        { id: 8, nome: "Dramin B6", preco: 8.00, marca: "Takeda", categoria: "Antiemético", principioAtivo: "Dimenidrinato, Cloridrato de Piridoxina", dosagem: "50mg + 10mg", qtdPorCaixa: "10 Comprimidos", quantidade: 55, imagemUrl: "https://ortopedistaemsaopaulo.com.br/wp-content/uploads/2022/12/dramin-b6.jpg" },
        { id: 9, nome: "Estomazil", preco: 11.20, marca: "Cosmed", categoria: "Antiácido", principioAtivo: "Bicarbonato de Sódio, Carbonato de Sódio, Ácido Cítrico", dosagem: "5g", qtdPorCaixa: "10 Envelopes", quantidade: 150, imagemUrl: "https://www.drogaraia.com.br/_next/image?url=https%3A%2F%2Fproduct-data.raiadrogasil.io%2Fimages%2F3810831.webp&w=3840&q=40" },
        { id: 10, nome: "Vick Pyrena", preco: 14.50, marca: "P&G", categoria: "Antigripal", principioAtivo: "Paracetamol", dosagem: "500mg", qtdPorCaixa: "5 Envelopes", quantidade: 130, imagemUrl: "https://www.drogaraia.com.br/_next/image?url=https%3A%2F%2Fproduct-data.raiadrogasil.io%2Fimages%2F7108561.webp&w=3840&q=40" },
        { id: 11, nome: "Resfenol", preco: 10.50, marca: "Kley Hertz", categoria: "Antigripal", principioAtivo: "Paracetamol, Maleato de Clorfeniramina, Cloridrato de Fenilefrina", dosagem: "400mg + 4mg + 4mg", qtdPorCaixa: "20 Cápsulas", quantidade: 88, imagemUrl: "https://io.convertiez.com.br/m/drogariaveracruz/shop/products/images/16060/medium/resfenol-20-capsulas_28262.png" },
        { id: 12, nome: "Benegrip", preco: 9.80, marca: "Hypera Pharma", categoria: "Antigripal", principioAtivo: "Dipirona, Maleato de Clorfeniramina, Cafeína", dosagem: "500mg + 2mg + 30mg", qtdPorCaixa: "12 Comprimidos", quantidade: 92, imagemUrl: "https://www.drogarianovaesperanca.com.br/imagens/600x600/benegrip-com-12-comprimidos-ae4f17b99b.jpg" },
        { id: 13, nome: "Salonpas", preco: 8.70, marca: "Hisamitsu", categoria: "Analgésico", principioAtivo: "Salicilato de Metila, Levomentol, Cânfora", dosagem: "N/A", qtdPorCaixa: "4 Adesivos", quantidade: 140, imagemUrl: "https://d2q99nmsismp7k.cloudfront.net/Custom/Content/Products/60/29/60297_salonpas-pq-c-4un-p54247_m1_637813974943390357.webp" },
        { id: 14, nome: "Cimegripe", preco: 7.99, marca: "Cimed", categoria: "Antigripal", principioAtivo: "Paracetamol, Maleato de Clorfeniramina, Cloridrato de Fenilefrina", dosagem: "400mg + 4mg + 4mg", qtdPorCaixa: "20 Cápsulas", quantidade: 25, imagemUrl: "https://du3hj28fogfli.cloudfront.net/Custom/Content/Products/45/25/45254_cimegripe-400mg-4mg-4mg-caixa-com-20-capsulas-gelatinosas-duras-p7896523200576_m1_637904718124994390.webp" },
        { id: 15, nome: "Maracugina PI", preco: 19.90, marca: "Hypera Pharma", categoria: "Calmante", principioAtivo: "Passiflora incarnata L.", dosagem: "260mg", qtdPorCaixa: "20 Comprimidos", quantidade: 65, imagemUrl: "https://hyperapharma.vteximg.com.br/arquivos/ids/162008-1000-1000/7896094918894-20220719-032204--1-.jpg?v=637938606615200000" },
        { id: 16, nome: "Melatonina", preco: 22.00, marca: "Biolab", categoria: "Suplemento", principioAtivo: "Melatonina", dosagem: "0,21mg", qtdPorCaixa: "30 Comprimidos", quantidade: 40, imagemUrl: "https://cdn1.staticpanvel.com.br/produtos/15/94892-15.jpg?ims=424x" },
        { id: 17, nome: "Imosec", preco: 16.50, marca: "Johnson & Johnson", categoria: "Antidiarreico", principioAtivo: "Cloridrato de Loperamida", dosagem: "2mg", qtdPorCaixa: "12 Comprimidos", quantidade: 35, imagemUrl: "https://d1jgmae0hcnr1i.cloudfront.net/Custom/Content/Products/91/80/91807_imosec-2mg-c-12-p62345_m1_638287296147723294.webp" },
        { id: 18, nome: "Luftal", preco: 13.40, marca: "Reckitt", categoria: "Antiflatulento", principioAtivo: "Simeticona", dosagem: "75mg/mL", qtdPorCaixa: "15ml", quantidade: 78, imagemUrl: "https://images.tcdn.com.br/img/img_prod/1170916/luftal_75mg_ml_gotas_15ml_18878_1_28379f47fcdd5a8d456a40cca19eda24.jpg" },
        { id: 19, nome: "Eno Sal de Fruta", preco: 3.50, marca: "GSK", categoria: "Antiácido", principioAtivo: "Bicarbonato de Sódio, Carbonato de Sódio, Ácido Cítrico", dosagem: "5g", qtdPorCaixa: "2 Envelopes", quantidade: 200, imagemUrl: "https://du3hj28fogfli.cloudfront.net/Custom/Content/Products/48/41/48415_sal-de-frutas-eno-2-envelopes-com-5g-de-po-efervescente-de-uso-oral-tradicional-p7896015560027_m2_637764748082683895.webp" },
        { id: 20, nome: "Torsilax", preco: 9.00, marca: "Neo Química", categoria: "Anti-inflamatório", principioAtivo: "Diclofenaco Sódico, Carisoprodol, Paracetamol, Cafeína", dosagem: "50mg + 125mg + 300mg + 30mg", qtdPorCaixa: "12 Comprimidos", quantidade: 105, imagemUrl: "https://d1jgmae0hcnr1i.cloudfront.net/Custom/Content/Products/15/72/157208_torsilax-c-12-cp-p63196_m1_638318523450346960.webp" },
        { id: 21, nome: "Histamin", preco: 10.20, marca: "Neo Química", categoria: "Antialérgico", principioAtivo: "Maleato de Dexclorfeniramina", dosagem: "2mg/5mL", qtdPorCaixa: "100ml", quantidade: 58, imagemUrl: "https://drogariaspacheco.vteximg.com.br/arquivos/ids/1375530-1000-1000/156051-Histamin-2mg-5ml-Neo-Quimica-100ml.jpg.jpg?v=638729871860170000" },
        { id: 22, nome: "Decongex Plus", preco: 21.00, marca: "Aché", categoria: "Descongestionante", principioAtivo: "Maleato de Bronfeniramina, Cloridrato de Fenilefrina", dosagem: "2mg/5mL + 5mg/5mL", qtdPorCaixa: "120ml", quantidade: 42, imagemUrl: "https://drogariasp.vteximg.com.br/arquivos/ids/1160013-1000-1000/80691---decongex-plus-ache-xarope-120ml_0001_0.png?v=638629700243500000" },
        { id: 23, nome: "Bálsamo Bengué", preco: 25.50, marca: "EMS", categoria: "Analgésico", principioAtivo: "Mentol, Salicilato de Metila, Cânfora", dosagem: "N/A", qtdPorCaixa: "60g", quantidade: 33, imagemUrl: "https://www.drogariaminasbrasil.com.br/media/webp/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/image/509324e5e/balsamo-bengue-aerossol-ems-com-60g-85ml_jpg.webp" },
        { id: 24, nome: "Gelo-Bio", preco: 18.00, marca: "União Química", categoria: "Analgésico", principioAtivo: "Mentol, Cânfora, Salicilato de Metila", dosagem: "N/A", qtdPorCaixa: "120ml", quantidade: 48, imagemUrl: "https://du3hj28fogfli.cloudfront.net/Custom/Content/Products/45/82/45828_gelo-bio-0-0333ml-ml-0-0333g-ml-0-0083g-ml-frasco-aerossol-com-150ml-de-solucao-de-uso-dermatologico-p7896006291749_l1_637787067711110644.webp" },
        { id: 25, nome: "Lactuliv", preco: 28.00, marca: "Legrand", categoria: "Laxante", principioAtivo: "Lactulose", dosagem: "667mg/mL", qtdPorCaixa: "120ml", quantidade: 62, imagemUrl: "https://drogariasp.vteximg.com.br/arquivos/ids/586217-1000-1000/223328---lactuliv-salada-de-frutas-legrand-pharma-120ml-xarope.jpg?v=638647831857930000" },
        { id: 26, nome: "Naturetti", preco: 35.00, marca: "Sanofi", categoria: "Laxante", principioAtivo: "Senna alexandrina", dosagem: "N/A", qtdPorCaixa: "30 Geleias", quantidade: 28, imagemUrl: "https://product-data.raiadrogasil.io/images/6841978.webp" },
        { id: 27, nome: "Vitamina C", preco: 11.80, marca: "Cimed", categoria: "Vitamina", principioAtivo: "Ácido Ascórbico", dosagem: "1g", qtdPorCaixa: "10 Comprimidos Efervescentes", quantidade: 180, imagemUrl: "https://product-data.raiadrogasil.io/images/3472788.webp" },
        { id: 28, nome: "Complexo B", preco: 15.00, marca: "Neo Química", categoria: "Vitamina", principioAtivo: "Vitaminas do Complexo B", dosagem: "N/A", qtdPorCaixa: "30 Comprimidos", quantidade: 160, imagemUrl: "https://cdn.ultrafarma.com.br/static/produtos/KA11641/large-638659172557198559-KA11641.png" },
        { id: 29, nome: "Strepsils", preco: 10.50, marca: "Reckitt", categoria: "Antisséptico Bucal", principioAtivo: "Flurbiprofeno", dosagem: "8.75mg", qtdPorCaixa: "8 Pastilhas", quantidade: 99, imagemUrl: "https://www.strepsils.com.br/media/052024/STREPSILS-MeleLimao8pastilhas_H1600.jpg" },
        { id: 30, nome: "Flogoral", preco: 13.90, marca: "Aché", categoria: "Antisséptico Bucal", principioAtivo: "Cloridrato de Benzidamina", dosagem: "3mg", qtdPorCaixa: "12 Pastilhas", quantidade: 82, imagemUrl: "https://drogariasp.vteximg.com.br/arquivos/ids/1159995-1000-1000/31593---flogoral-menta-ache-12-pastilhas_0000_Layer-1.png?v=638629694123730000" },
        { id: 31, nome: "Epocler", preco: 12.00, marca: "Hypera Pharma", categoria: "Protetor Hepático", principioAtivo: "Citrato de Colina, Betaína, Metionina", dosagem: "N/A", qtdPorCaixa: "6 Flaconetes", quantidade: 115, imagemUrl: "https://www.drogarianovaesperanca.com.br/imagens/600x600/epocler-com-6-flaconetes-de-10ml-68c114c81c.jpg" },
        { id: 32, nome: "Engov", preco: 8.50, marca: "Hypera Pharma", categoria: "Analgésico", principioAtivo: "Maleato de Mepiramina, Hidróxido de Alumínio, Ácido Acetilsalicílico, Cafeína", dosagem: "15mg + 150mg + 150mg + 50mg", qtdPorCaixa: "6 Comprimidos", quantidade: 135, imagemUrl: "https://images.tcdn.com.br/img/img_prod/1170916/engov_6_comprimidos_11929_1_5ec01b959488725d31366155275840d.jpg" },
        { id: 33, nome: "Cataflampro", preco: 32.00, marca: "GSK", categoria: "Anti-inflamatório", principioAtivo: "Diclofenaco Dietilamônio", dosagem: "11.6mg/g", qtdPorCaixa: "60g", quantidade: 53, imagemUrl: "https://drogariacoop.vtexassets.com/arquivos/ids/158897/7896261005723.jpg?v=638010889395900000" },
        { id: 34, nome: "Neolefrin", preco: 14.50, marca: "Neo Química", categoria: "Antigripal", principioAtivo: "Paracetamol, Maleato de Clorfeniramina, Cloridrato de Fenilefrina", dosagem: "40mg/mL + 0.6mg/mL + 0.6mg/mL", qtdPorCaixa: "120ml", quantidade: 68, imagemUrl: "https://www.drogariaminasbrasil.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/image/101751e752/neolefrin-xarope-60ml-neo-quimica.jpg" },
        { id: 35, nome: "Alivium", preco: 19.80, marca: "Cosmed", categoria: "Anti-inflamatório", principioAtivo: "Ibuprofeno", dosagem: "600mg", qtdPorCaixa: "10 Cápsulas", quantidade: 72, imagemUrl: "https://www.drogariaminasbrasil.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/image/579688e92/alivium-600mg-com-10-capsulas-moles.jpg" },
        { id: 36, nome: "Sonrisal", preco: 3.80, marca: "GSK", categoria: "Antiácido", principioAtivo: "Ácido Acetilsalicílico, Bicarbonato de Sódio, Ácido Cítrico", dosagem: "N/A", qtdPorCaixa: "2 Envelopes", quantidade: 190, imagemUrl: "https://du3hj28fogfli.cloudfront.net/Custom/Content/Products/48/43/48430_sonrisal-blister-com-2-comprimidos-efervescentes-sabor-tradicional-p7896090611607_m1_637764783474801859.webp" },
        { id: 37, nome: "Atroveran Dip", preco: 11.00, marca: "Hypera Pharma", categoria: "Analgésico", principioAtivo: "Dipirona Monoidratada", dosagem: "1g", qtdPorCaixa: "10 Comprimidos", quantidade: 81, imagemUrl: "https://hyperapharma.vteximg.com.br/arquivos/ids/156464-1000-1000/image-3604c9718de048eca898f8049b0622a5.jpg?v=637716550379600000" },
        { id: 38, nome: "Maxalgina", preco: 8.90, marca: "Natulab", categoria: "Analgésico", principioAtivo: "Dipirona Monoidratada", dosagem: "1g", qtdPorCaixa: "10 Comprimidos", quantidade: 94, imagemUrl: "https://www.drogarianovaesperanca.com.br/imagens/600x600/maxalgina-1g-com-10-comprimidos-b047f4216c.jpg" },
        { id: 39, nome: "Ginkomed", preco: 45.00, marca: "Cimed", categoria: "Vasodilatador", principioAtivo: "Ginkgo Biloba", dosagem: "80mg", qtdPorCaixa: "30 Comprimidos", quantidade: 22, imagemUrl: "https://paguemenos.vtexassets.com/arquivos/ids/317392/24211-GINKOMED-80MG-COMP-REV-30-COMP-7896523206479.png?v=637630059946470000" },
        { id: 40, nome: "Caladryl Pós-Sol", preco: 38.00, marca: "Johnson & Johnson", categoria: "Dermatológico", principioAtivo: "Calamina, Cânfora", dosagem: "N/A", qtdPorCaixa: "150ml", quantidade: 18, imagemUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROa1Tosmql0-rXJQ7co6f20X3Os0S1mMsVeA&s" },
        { id: 41, nome: "Nebacetin", preco: 17.50, marca: "Takeda", categoria: "Dermatológico", principioAtivo: "Sulfato de Neomicina, Bacitracina Zíncica", dosagem: "5mg/g + 250UI/g", qtdPorCaixa: "15g", quantidade: 77, imagemUrl: "https://farma22.vtexassets.com/arquivos/ids/188563-800-auto?v=638661528335070000&width=800&height=auto&aspect=true" },
        { id: 42, nome: "Minancora", preco: 12.90, marca: "Minancora", categoria: "Antisséptico", principioAtivo: "Óxido de Zinco, Cânfora, Cloreto de Benzalcônio", dosagem: "N/A", qtdPorCaixa: "30g", quantidade: 102, imagemUrl: "https://farma22.vtexassets.com/arquivos/ids/187080/Minancora-Pomada-30g.png?v=638450172193970000" },
        { id: 43, nome: "Nimesulida", preco: 10.00, marca: "EMS", categoria: "Anti-inflamatório", principioAtivo: "Nimesulida", dosagem: "100mg", qtdPorCaixa: "12 Comprimidos", quantidade: 125, imagemUrl: "https://d1jgmae0hcnr1i.cloudfront.net/Custom/Content/Products/89/79/89797_nimesulida-100mg-c-12cpr-p64252_m1_638283143491994824.webp" },
        { id: 44, nome: "Tamarine", preco: 25.00, marca: "Hypera Pharma", categoria: "Laxante", principioAtivo: "Senna alexandrina, Cassia fistula", dosagem: "N/A", qtdPorCaixa: "12 Cápsulas", quantidade: 38, imagemUrl: "https://www.drogarianovaesperanca.com.br/imagens/600x600/tamarine-12mg-com-20-capsulas-16b8689df9.jpg" },
        { id: 45, nome: "Floratil", preco: 30.00, marca: "Merck", categoria: "Probiótico", principioAtivo: "Saccharomyces boulardii", dosagem: "200mg", qtdPorCaixa: "6 Cápsulas", quantidade: 46, imagemUrl: "https://www.drogariaminasbrasil.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/image/13504e5c0/floratil-200mg-c-6-capsulas.jpg" },
        { id: 46, nome: "Expec", preco: 15.50, marca: "Legrand", categoria: "Expectorante", principioAtivo: "Cloridrato de Oxomemazina, Iodeto de Potássio, Benzoato de Sódio, Guaifenesina", dosagem: "N/A", qtdPorCaixa: "120ml", quantidade: 51, imagemUrl: "https://www.drogarianovaesperanca.com.br/imagens/600x600/expec-xarope-com-120ml-8aa97b49b5.jpg" },
        { id: 47, nome: "Biotônico Fontoura", preco: 20.00, marca: "Hypera Pharma", categoria: "Suplemento", principioAtivo: "Sulfato Ferroso Heptaidratado", dosagem: "N/A", qtdPorCaixa: "400ml", quantidade: 66, imagemUrl: "https://hyperapharma.vteximg.com.br/arquivos/ids/162265-1000-1000/21007.jpg?v=637958258311370000" },
        { id: 48, nome: "Merthiolate", preco: 9.50, marca: "Cosmed", categoria: "Antisséptico", principioAtivo: "Digliconato de Clorexidina", dosagem: "10mg/mL", qtdPorCaixa: "30ml", quantidade: 89, imagemUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-n6L_pN1IYXNmiOS9nGUkRlgfuEQpk708Qw&s" },
        { id: 49, nome: "Água Oxigenada", preco: 3.00, marca: "Farmax", categoria: "Antisséptico", principioAtivo: "Peróxido de Hidrogênio", dosagem: "10 volumes", qtdPorCaixa: "100ml", quantidade: 175, imagemUrl: "https://cdn.ultrafarma.com.br/static/produtos/814234/large-636996791392418923-814234.jpg" },
        { id: 50, nome: "Maleato de Dexclorfeniramina", preco: 7.00, marca: "Medley", categoria: "Antialérgico", principioAtivo: "Maleato de Dexclorfeniramina", dosagem: "2mg/5mL", qtdPorCaixa: "120ml", quantidade: 112, imagemUrl: "https://farmaciaindiana.vtexassets.com/arquivos/ids/260112-800-auto?v=637959222353070000&width=800&height=auto&aspect=true" }
    ];
    saveFarmacos(farmacos);
    return farmacos;
  };

  // ========================
  //  CRUD e Lógica de Negócio
  // ========================

  //Adiciona um fármaco novo
  const addFarmaco = (farmacos, newFarmaco) => [...farmacos, newFarmaco];
  //Altera um farmaco ja existente
  const updateFarmaco = (farmacos, id, updates) => farmacos.map(f => (f.id === id ? { ...f, ...updates } : f));
  //Apaga um farmaco da lista
  const deleteFarmaco = (farmacos, id) => farmacos.filter(f => f.id !== id);
  //Encontra o farmaco pelo id
  const findFarmacoById = ([f, ...r], id) => f === undefined ? null : (f.id === id ? f : findFarmacoById(r, id));
  //Calcula a quantidade de farmacos que tem no estoque
  const countFarmacos = ([f, ...r]) => f === undefined ? 0 : 1 + countFarmacos(r);
  //Ela retorna o próximo ID disponível para um novo fármaco
  const getNextId = (farmacos) => {
      if (!farmacos || farmacos.length === 0) return 1; //Verifica se o array farmacos é inexistente ou está vazio.
      return farmacos.reduce((maxId, f) => Math.max(f.id, maxId), 0) + 1;
      //Em cada iteração, compara o id do fármaco atual com o maior ID encontrado até agora (maxId).
      //Retorna sempre o maior entre os dois
      //Soma 1 pois o id utilizado será 1 a + q o maior encontrado
  };
  //Procura os farmacos pelo nome/marca/pricipioAtivo
  const searchFarmacos = (farmacos, term) => {
      const lowerTerm = term.toLowerCase();
      return farmacos.filter(f => 
          f.nome.toLowerCase().includes(lowerTerm) ||
          f.marca.toLowerCase().includes(lowerTerm) ||
          f.principioAtivo.toLowerCase().includes(lowerTerm)
      );
  };
  //Calcula o valor total do estoque (soma da qnt de cada farmaco * o preço de cada um)
  const calculateEstoqueValue = (farmacos) =>
  farmacos
    .map(f => f.preco * f.quantidade) //Mapeia a multiplicaçao do preço e quantidadde
    .filter(v => typeof v === 'number' && !isNaN(v)) //garante que é um numero
    .reduce((total, v) => total + v, 0); //faz a soma com o acumulador

  const calculateQtdeTotal = (farmacos) =>
  farmacos
    .map(f => f.quantidade) //mapeia somente a quantidade
    .filter(q => typeof q === 'number') //garante que é um numero
    .reduce((total, q) => total + q, 0); //faz a soma com o acumulador

  //lista com os valores únicos de uma determinada chave (key), ordenados em ordem alfabética
  //Cria um conjunto(não aceita valores repetidos) de uma key especifica, filtra excluindo valores indefinidos/false
  //Para finalizar retorna para um array com o .sort
  const getUniqueValuesByKey = (farmacos, key) => 
    [...new Set(farmacos.map(f => f[key]).filter(Boolean))].sort();; 
                                                                              
  //Ordena os farmacos com base em uma chave específica (key), em ordem crescente ou decrescente
    const sortFarmacos = (farmacos, key, direction = 'asc') =>
  [...farmacos].sort((a, b) => { //copia a lista e com o .sort cria uma comparação entre 2 elementos
    const valA = a[key] ?? null; //Garante que se o valor for undefined se torne null
    const valB = b[key] ?? null; // ''

    const handleNull = () => //define a ordem do valor null
      valA === null && valB !== null ? 1 : //se valA for null, a deve ficar depois de b
      valB === null && valA !== null ? -1 : //se valA não for null, a deve ficar antes de b
      0;
  
    const compareStrings = () =>  //Compara os valores se forem string
      direction === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);

        const compareNumbers = () =>     //Comparra os valores se forem numeros
      direction === 'asc'
        ? valA - valB
        : valB - valA;

    return valA === null || valB === null //se ouver valor null chama handleNull para decidir a ordem
      ? (direction === 'asc' ? handleNull() : -handleNull()) //se a direção por descrescente inverte o resultado de handleNull
      : (typeof valA === 'string' && typeof valB === 'string' //se os valores n forem nulo chama as funções de comparação
          ? compareStrings()
          : compareNumbers());
  });

  // ========================
  // Funções Avançadas
  // ========================

  //Lista o farmaco mais barato por nome
  const findCheapestOfEachFarmaco = (farmacos) =>
  Object.values(
    farmacos.reduce((acc, f) => { //acc para guardar sempre o farmaco de menor preço
      const key = f.nome.toLowerCase(); //converte o nome do farmaco para letra minuscula
      const existing = acc[key]; //verifica se ja existe um farmaco com esse nome no acumulador

      return { //se o preço do novo for menor do q o do acumulador, guarda-se o novo, se não, mantém oq a está no acc
        ...acc,
        [key]: !existing || f.preco < existing.preco ? f : existing
      };
    }, {})
  );
  //Lista o farmaco mais barato de cada marca
  const findCheapestOfEachMarca = (farmacos) =>
  Object.values(
    farmacos.reduce((acc, f) => { //acc para guardar sempre o farmaco de menor preço
      const key = f.marca.toLowerCase(); //converte a marca para letra minuscula
      const existing = acc[key]; //verifica se ja existe um farmaco dessa no acumulador

      return { //se o preço do novo for menor do q o do acumulador, guarda-se o novo, se não, mantém oq a está no acc
        ...acc,
        [key]: !existing || f.preco < existing.preco ? f : existing
      };
    }, {})
  );
  //Remove farmacos repetidos, comparando o nome/marca/dosagem/qtdporcaixa
  const removeDuplicates = (farmacos) => {
    const uniqueFarmacos = new Map(); //cria um map vazio
    farmacos.forEach(f => {
      //Cria uma chave q junte as propriedades de cada farmaco e transforma para letra minuscula
      const key = `${f.nome}|${f.marca}|${f.dosagem}|${f.qtdPorCaixa}`.toLowerCase();
      uniqueFarmacos.set(key, f); //.set adiciona essa key no map vazio
      //como o map não aceita chaves duplicadas, sera guardada a mais recente    }
    })
    return Array.from(uniqueFarmacos.values()); //retorna um array com os valores do map(unicos)
    }
    
  // Retorna um array vazio, limpando efetivamente o estoque.
  const clearAllFarmacos = () => [];
  
  /**
   * Procura por um fármaco duplicado na lista de estoque.
   * A duplicata é definida por uma combinação de nome, marca e dosagem.
   * @param {Array} farmacos - A lista atual do estoque.
   * @param {Object} farmacoToCheck - O novo fármaco que se deseja adicionar.
   * @returns {Object|undefined} - Retorna o fármaco existente se for duplicado, caso contrário, undefined.
   */
  const findDuplicateFarmaco = (farmacos, farmacoToCheck) => {
    const normalize = str => str.toLowerCase().trim();
    return farmacos.find(f =>
      normalize(f.nome) === normalize(farmacoToCheck.nome) &&
      normalize(f.marca) === normalize(farmacoToCheck.marca) &&
      normalize(f.dosagem) === normalize(farmacoToCheck.dosagem)
    );
  };
  
    // --- ADIÇÃO: NOVAS FUNÇÕES PARA OS GRÁFICOS DE ESTATÍSTICAS ---

  /**
   * Processa os dados para o gráfico de pizza de distribuição por categoria.
   * @param {Array} farmacos - A lista de fármacos do estoque.
   * @returns {Object} - Um objeto com 'labels' (nomes das categorias) e 'data' (contagem de itens por categoria).
   */
  const getDataForCategoryPieChart = (farmacos) => {
    // Usa 'reduce' para contar quantos itens existem em cada categoria.
    const categoryCounts = farmacos.reduce((acc, farmaco) => {
      const category = farmaco.categoria || 'Sem Categoria';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Separa as chaves (nomes das categorias) e os valores (contagens) em arrays separados.
    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);

    return { labels, data };
  };

  /**
   * Processa os dados para o gráfico de barras das top 5 marcas por quantidade de unidades.
   * @param {Array} farmacos - A lista de fármacos do estoque.
   * @returns {Object} - Um objeto com 'labels' (nomes das marcas) e 'data' (soma das quantidades).
   */
  const getDataForTopMarcasBarChart = (farmacos) => {
    // Usa 'reduce' para somar a quantidade total de unidades por marca.
    const marcaCounts = farmacos.reduce((acc, farmaco) => {
      const marca = farmaco.marca || 'Sem Marca';
      acc[marca] = (acc[marca] || 0) + farmaco.quantidade;
      return acc;
    }, {});

    // Converte o objeto para um array, ordena do maior para o menor, e pega os 5 primeiros.
    const sortedMarcas = Object.entries(marcaCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Separa os nomes e as quantidades em arrays.
    const labels = sortedMarcas.map(([marca]) => marca);
    const data = sortedMarcas.map(([, count]) => count);

    return { labels, data };
  };

  /**
   * Processa os dados para o gráfico de barras horizontais de valor por categoria.
   * @param {Array} farmacos - A lista de fármacos do estoque.
   * @returns {Object} - Um objeto com 'labels' (nomes das categorias) e 'data' (soma dos valores em R$).
   */
  const getDataForCategoryValueBarChart = (farmacos) => {
    // Usa 'reduce' para somar o valor total (preço * quantidade) por categoria.
    const categoryValues = farmacos.reduce((acc, farmaco) => {
      const category = farmaco.categoria || 'Sem Categoria';
      const value = farmaco.preco * farmaco.quantidade;
      acc[category] = (acc[category] || 0) + value;
      return acc;
    }, {});

    // Converte para array e ordena do maior valor para o menor.
    const sortedCategories = Object.entries(categoryValues)
      .sort(([, a], [, b]) => b - a);

    const labels = sortedCategories.map(([category]) => category);
    const data = sortedCategories.map(([, value]) => value);

    return { labels, data };
  };      
    
  //Retorna todas as funções definidas, podendo assim utiliza-las em outro arquivo(ui.js)
  return {
    loadFarmacos, saveFarmacos, clearFarmacos, resetFarmacos,
    addFarmaco, updateFarmaco, deleteFarmaco,
    findFarmacoById, countFarmacos, getNextId,
    searchFarmacos, calculateEstoqueValue, calculateQtdeTotal, getUniqueValuesByKey,
    sortFarmacos, findCheapestOfEachFarmaco, findCheapestOfEachMarca, removeDuplicates, clearAllFarmacos, findDuplicateFarmaco, getDataForCategoryPieChart, getDataForTopMarcasBarChart, getDataForCategoryValueBarChart
  }
})();
