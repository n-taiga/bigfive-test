const questions = [
  // --- N: 神経症傾向 (12問) ---
  { id: '43c98ce8-a07a-4dc2-80f6-c1b2a2485f06', text: '心配性だ', keyed: 'plus', domain: 'N', facet: 1 },
  { id: '4d81238b-5407-47d4-88e5-dc0e38aa14f5', text: 'さまざまなことに対して不安がある', keyed: 'plus', domain: 'N', facet: 1 },
  { id: '48ad12ce-470e-4339-90ac-ea8c43a0103e', text: '短気だ', keyed: 'plus', domain: 'N', facet: 2 },
  { id: 'd32bd062-4eb2-401b-99b2-e7afea39ca9b', text: '簡単にイライラしないほうだ', keyed: 'minus', domain: 'N', facet: 2 },
  { id: '5e8550d7-b8ef-4905-950a-f81d735d39e2', text: '憂鬱な気分になることが多い', keyed: 'plus', domain: 'N', facet: 3 },
  { id: 'f40e421f-6c24-4be2-bd9f-28d33358d8c6', text: '今の自分に満足している', keyed: 'minus', domain: 'N', facet: 3 },
  { id: 'b2d9ef74-73f5-4ea8-b00c-7aaca15937df', text: '他人に近づくことが苦手だ', keyed: 'plus', domain: 'N', facet: 4 },
  { id: '7317848c-3e1b-422f-bb16-02efc504f677', text: '困難な社会情勢に悩まされないほうだ', keyed: 'minus', domain: 'N', facet: 4 },
  { id: '481efd08-c810-43b1-a952-f8ac9052f96b', text: '暴飲暴食をしがちだ', keyed: 'plus', domain: 'N', facet: 5 },
  { id: '49a85680-53aa-4208-86b5-dccc7a6f8e37', text: '欲求をコントロールできるほうだ', keyed: 'minus', domain: 'N', facet: 5 },
  { id: '2f519935-92e8-48ad-9746-4a0f8b38466a', text: '慌てやすい', keyed: 'plus', domain: 'N', facet: 6 },
  { id: '88a3c2fe-3aa4-4f46-9322-da656332268a', text: 'プレッシャーの中でも落ち着いていられる', keyed: 'minus', domain: 'N', facet: 6 },

  // --- E: 外向性 (12問) ---
  { id: 'd50a597f-632b-4f7b-89e6-6d85b50fd1c9', text: '友達を作るのは簡単だ', keyed: 'plus', domain: 'E', facet: 1 },
  { id: '41702602-08e4-4e2b-9a19-291d9efc581a', text: '他人と距離をとりがちだ', keyed: 'minus', domain: 'E', facet: 1 },
  { id: '458f3957-2359-4077-ade1-34525d633063', text: '大きなパーティが好きだ', keyed: 'plus', domain: 'E', facet: 2 },
  { id: '03c10b30-b88f-4c63-8acc-71251ca24615', text: '一人でいることを好む', keyed: 'minus', domain: 'E', facet: 2 },
  { id: '8af754f2-68e9-48f3-8c5d-2e6633d4472c', text: '世話を焼きがちだ', keyed: 'plus', domain: 'E', facet: 3 },
  { id: '8791f37b-686f-47c3-9db7-74c009951321', text: '他人が導いてくれるのを待ちがちだ', keyed: 'minus', domain: 'E', facet: 3 },
  { id: '48a761ef-438e-409b-ae59-ea2ce8f84414', text: 'いつも忙しいほうだ', keyed: 'plus', domain: 'E', facet: 4 },
  { id: '7d93e1ca-46e8-4a30-9623-42a80c9b420c', text: '気楽にやることが好きだ', keyed: 'minus', domain: 'E', facet: 4 },
  { id: '987efee2-899f-4a65-b9b5-1589ef0460d7', text: '刺激的なことが大好きだ', keyed: 'plus', domain: 'E', facet: 5 },
  { id: '7dd6cf2d-5c14-48c2-8ae5-633a7a596c71', text: '無茶をすることは楽しい', keyed: 'plus', domain: 'E', facet: 5 },
  { id: '899c3f66-51d0-46ea-963a-6fc36d3b3cb9', text: '喜びで満ち溢れている', keyed: 'plus', domain: 'E', facet: 6 },
  { id: 'e7b31bdc-5f6b-40ec-ba91-f5919b0f170e', text: '人生を肯定的に見るほうだ', keyed: 'plus', domain: 'E', facet: 6 },

  // --- O: 開放性 (12問) ---
  { id: '888dd864-7449-4e96-8d5c-7a439603ea91', text: '想像力が豊かだ', keyed: 'plus', domain: 'O', facet: 1 },
  { id: '935a7413-abac-4f54-9169-d1fbd39da752', text: '思索に耽ることが好きだ', keyed: 'plus', domain: 'O', facet: 1 },
  { id: '58d571e5-d725-4cf8-a438-32c16ee28eb6', text: '芸術は重要だと思う', keyed: 'plus', domain: 'O', facet: 2 },
  { id: '87c5b27e-59a8-4c48-8ba8-f5413d735693', text: '美術館に行っても楽しめない', keyed: 'minus', domain: 'O', facet: 2 },
  { id: '0727def6-3d18-4221-bf38-86b58f9f3eed', text: '感情的なほうだ', keyed: 'plus', domain: 'O', facet: 3 },
  { id: '4fd25155-9cc2-4cd6-8852-3e0ca2d5e95d', text: '感情的になる人を理解できない', keyed: 'minus', domain: 'O', facet: 3 },
  { id: 'cae55842-8957-4e3b-83b3-ceff98fb9dcf', text: 'いつも同じよりも変化に富むことを好む', keyed: 'plus', domain: 'O', facet: 4 },
  { id: 'a7f43928-8982-4ed5-8656-7a80346fe979', text: '伝統的なやり方に固執しがちだ', keyed: 'minus', domain: 'O', facet: 4 },
  { id: 'e1e804c7-4a1d-498f-8610-f95147af9d1d', text: '難しい読み物が好きだ', keyed: 'plus', domain: 'O', facet: 5 },
  { id: 'b86de003-c3c4-4cc8-9385-5ac8a0142c34', text: '理論的な議論には興味がないほうだ', keyed: 'minus', domain: 'O', facet: 5 },
  { id: '79186f48-e7fa-4df4-b74b-b0627ee244e1', text: '選挙ではリベラルな候補者に投票するほうだ', keyed: 'plus', domain: 'O', facet: 6 },
  { id: '580b08d1-3c94-46e9-9d07-d6d80c698127', text: '犯罪には厳しくあるべきだと思う', keyed: 'minus', domain: 'O', facet: 6 },

  // --- A: 協調性 (12問) ---
  { id: 'ce2fbbf8-7a97-4199-bda5-117e4ecdf3b6', text: '他人を信頼するほうだ', keyed: 'plus', domain: 'A', facet: 1 },
  { id: '432dbde8-8756-4ff0-80d5-f47018235139', text: '他人は信用しないほうだ', keyed: 'minus', domain: 'A', facet: 1 },
  { id: '0cf79e27-e702-45c2-9471-04ac96b58e0e', text: '自分のために他人を利用するほうだ', keyed: 'minus', domain: 'A', facet: 2 },
  { id: '11b20adb-abed-4363-894c-3dd823ae0540', text: '他人の計画を妨害しがちだ', keyed: 'minus', domain: 'A', facet: 2 },
  { id: 'ccf3a5c8-fb50-4bd4-8e7a-22af3d657279', text: '人助けが好きだ', keyed: 'plus', domain: 'A', facet: 3 },
  { id: 'b68af20d-24f9-4c27-85cc-fe0858994888', text: '他人のために時間はかけないほうだ', keyed: 'minus', domain: 'A', facet: 3 },
  { id: 'e2028ad3-b128-4f76-be57-398bfe2aff22', text: '健闘することが大好きだ', keyed: 'minus', domain: 'A', facet: 4 },
  { id: '17910a55-a64a-4ed0-8b46-293e2fa2fe03', text: '他人に仕返しをしがちだ', keyed: 'minus', domain: 'A', facet: 4 },
  { id: '71029381-3908-4c68-91e1-e41fb45542a2', text: '自分は他人よりも優れていると思う', keyed: 'minus', domain: 'A', facet: 5 },
  { id: '80c1d149-7050-481a-9953-aefb441642e7', text: '自慢しがちだ', keyed: 'minus', domain: 'A', facet: 5 },
  { id: 'fd50e1ca-d9e0-4037-a7a1-a191d4db2d96', text: 'ホームレスには同情する', keyed: 'plus', domain: 'A', facet: 6 },
  { id: '48bee420-60c0-45cd-be43-3893dbc1969a', text: '貧しい人のことは考えないようにしている', keyed: 'minus', domain: 'A', facet: 6 },

  // --- C: 誠実性 (12問) ---
  { id: 'c7f53c3c-2e77-432f-bb71-7470b67d3aa9', text: '仕事は完璧にこなすほうだ', keyed: 'plus', domain: 'C', facet: 1 },
  { id: '5727c93f-317b-4af1-a686-77fc9fbc5033', text: '要領が良いほうだ', keyed: 'plus', domain: 'C', facet: 1 },
  { id: 'cda1ca17-b599-4561-a6cd-ff9d36062d27', text: 'きれい好きだ', keyed: 'plus', domain: 'C', facet: 2 },
  { id: '50418d86-712c-45d9-adc4-ea0231c93cf5', text: '自分の所有物を放置しがちだ', keyed: 'minus', domain: 'C', facet: 2 },
  { id: '73d84e5d-cbf5-47f0-b8cb-4d2159a52e32', text: '約束は守るほうだ', keyed: 'plus', domain: 'C', facet: 3 },
  { id: '54423933-0ebb-44a7-bdd9-2a9b100c70f2', text: '約束を反故にしがちだ', keyed: 'minus', domain: 'C', facet: 3 },
  { id: 'b7fc949b-02b6-4cb9-a3e2-dbb3d824b55f', text: '一生懸命に働くほうだ', keyed: 'plus', domain: 'C', facet: 4 },
  { id: '3890bb43-2695-4b8d-b289-ee10d11cc884', text: '仕事に時間や労力を割きたくない', keyed: 'minus', domain: 'C', facet: 4 },
  { id: 'f6076eea-56ae-4b46-97f1-5f94a7676c96', text: 'いつも準備万端だ', keyed: 'plus', domain: 'C', facet: 5 },
  { id: '51403620-968c-42fa-a772-65ba5ad8396f', text: '仕事を始めることは難しい', keyed: 'minus', domain: 'C', facet: 5 },
  { id: 'bd9eec0a-b68b-472c-8803-7db29c308cdb', text: '考えなしに行動しがちだ', keyed: 'minus', domain: 'C', facet: 6 },
  { id: 'ea3327ea-3529-4be4-8e2d-2174731ae4d7', text: '考えなしに行動するほうだ', keyed: 'minus', domain: 'C', facet: 6 }
]

export default questions
