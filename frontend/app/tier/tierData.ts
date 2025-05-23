const tier_details = `tier	name	name_alt	description	color
0	Z	T0	Leagues above competition	e9e9e9
1	S	T0.5	Current strongest choice with optimal team	D43636
2	A	T1	Good performance with optimal team	6BD36F
3	B	T1.5	Viable with optimal team	38B3DA
4	C	T2	Useable with eidolons / investment / good matchups	B2C75F
5	D	T3	Not viable	C58142
6	N/A	N/A	Not currently ranked, could be anything	A92626`

const tier_details_array = tier_details.split('\n').map(line => line.split('\t'));
const tier_details_headers = tier_details_array[0];

const tier_details_columns: any[] = [];
for (let i = 0; i < tier_details_headers.length; i++) {
  const column = [];
  for (let j = 1; j < tier_details_array.length; j++) {
    column.push(tier_details_array[j][i]);
  }
  tier_details_columns.push(column);
}

const tier_details_headers_index : any = {};
for (let i = 0; i < tier_details_headers.length; i++) {
  tier_details_headers_index[tier_details_headers[i]] = i;
}
// const tier_details_headers_index: any = tier_details_headers.reduce((acc: any, header: string, index: number) => {
//     acc[header] = index;
//     return acc;
//     }
// , {});
// const tier_details_headers_index : any = {
//     "tier": 0,
//     "name": 1,
//     "name_alt": 2,
//     "description": 3
// }


const tier_content = `id	name	tier	tier_name	rational	assumed_eidolon	tag	tag_detail
8008	Trailblazer	1	S	Fits unique archetype, similar to robin	6	support	crit,enable_superbreak,target
8007	Trailblazer	1	S	Fits unique archetype, similar to robin	6	support	crit,enable_superbreak,target
8006	Trailblazer	3	B	Super break enabler, rank is tied to highest ranked super break dps	6	support	break,enable_superbreak
8005	Trailblazer	3	B	Super break enabler, rank is tied to highest ranked super break dps	6	support	break,enable_superbreak
8004	Trailblazer	6	N/A		6	sustain	
8003	Trailblazer	6	N/A		6	sustain	
8002	Trailblazer	6	N/A		6	dps	
8001	Trailblazer	6	N/A		6	dps	
1409	Hyacine	6	N/A		0	sustain	healer
1407	Castorice	1	S	High damage	0	dps	crit,hp,drain,require_healer,sp_good,memosprite
1406	Cipher	6	N/A		0	support	
1405	Anaxa	1	S	Great single target dps + herta option	0	dps,subdps	crit,atk,skill,weakness
1404	Mydei	1	S	High damage	0	dps	
1403	Tribbie	0	Z	No equivalent, synergies with many meta dpss	0	support	fua,respen,vuln,aura
1402	Aglaea	1	S	High damage, requires considerations	0	dps	crit,atk,memosprite
1401	The Herta	1	S	High damage	0	dps	require_erudition,skill,crit,atk
1317	Rappa	2	A		0	dps	break,superbreak
1315	Boothill	2	A		0	dps	break,superbreak,weakness
1314	Jade	2	A	Herta battery	0	subdps	crit,atk,fua,waveclear
1313	Sunday	1	S	Powerful base kit, some meta synergies	0	support	dmg%,crit,av,av_memo,energy,target
1312	Misha	6	N/A		6	dps,subdps	
1310	Firefly	3	B	Solid dps	0	dps	break,superbreak,weakness
1309	Robin	1	S	Powerful base kit, some meta synergies	0	support	av,atk,fua,dmg%,aura
1308	Acheron	2	A	Solid dps	0	dps	crit,atk,ultimate,require_nihility,require_debuff
1307	Black Swan	5	D	Perhaps too harsh, though considerably worse than Jingliu	0	subdps	dot,def%,debuff,atk
1306	Sparkle	3	B		0	support	av,target,aura,atk,crit,dmg%
1305	Dr. Ratio	3	B	Solid dps	0	dps	crit,atk,fua,require_debuff
1304	Aventurine	2	A	Good upgrade for fua teams, good buffing capabilities	0	sustain,support	shielder,fua,vuln,crit,debuff
1303	Ruan Mei	1	S	Weaker than competition, however too many viable synergies	1	support	break,breakeff,respen,def,spd,aura,dmg%
1302	Argenti	2	A	Herta battery	0	dps,subdps	crit,atk,ultimate
1301	Gallagher	2	A	Castorice battery, high weakness gauge, sp battery, break vuln	6	sustain	healer,sp_good,break,debuff
1225	Fugue	2	A	Super break enabler, rank is tied to highest ranked super break dps	0	support	break,defpen,enable_superbreak,aura,target
1224	March 7th	2	A	Feixiao synergy	6	subdps	crit,atk,fua
1223	Moze	6	N/A		6	subdps	crit,atk,fua
1222	Lingsha	3	B	Very high weakness gauge damage, break vuln, limited to firefly due to element	0	sustain	healer,break,summon
1221	Yunli	3	B		0	dps	crit,atk,counter
1220	Feixiao	1	S	High damage, single target specialty	0	dps	crit,atk,ultimate,fua
1218	Jiaoqiu	2	A	Acheron BiS	0	support	vulnerability,defpen,debuff
1217	Huohuo	2	A	Most potent buffs compared to other sustains	0	sustain,support	healer,energy,atk
1215	Hanya	6	N/A		6	support	
1214	Xueyi	6	N/A		6	dps,subdps	break
1213	Dan Heng • Imbibitor Lunae	3	B	Excels with eidolons, viable at E0	0	dps	crit,atk
1212	Jingliu	4	C	Viable with eidolons	0	dps	hp,crit,drain
1211	Bailu	6	N/A		2	sustain	healer,dmgreduc,revive
1210	Guinaifen	6	N/A		6	dps	
1209	Yanqing	6	N/A		2	dps	
1208	Fu Xuan	3	B	Decent buffing capabilities	1	sustain,support	dmgreduc,crit
1207	Yukong	6	N/A		6	support	
1206	Sushang	6	N/A		6	dps	
1205	Blade	3	B	Castorice battery	1	dps,subdps	hp,crit,drain
1204	Jing Yuan	3	B	Solid dps	0	dps	atk,crit,summon
1203	Luocha	2	A	Castorice battery, sp battery	0	sustain	healer,sp_good
1202	Tingyun	3	B	Incredible potential, no meta dps to fit	6	support	energy,atk,dmg%,target
1201	Qingque	6	N/A		6	dps	
1112	Topaz & Numby	2	A	Feixiao synergy	0	subdps	crit,atk,fua
1111	Luka	6	N/A		6	subdps	
1110	Lynx	6	N/A		6	sustain	
1109	Hook	6	N/A		6	dps	
1108	Sampo	6	N/A		6	subdps	
1107	Clara	6	N/A		2	dps	crit,atk,counter
1106	Pela	2	A	Acheron battery	6	support	def,debuff
1105	Natasha	6	N/A		6	sustain	
1104	Gepard	6	N/A		2	sustain	
1103	Serval	2	A	Herta battery	6	dps,subdps	
1102	Seele	4	C	Very strong (T0.5-T1) against good matchups, demands investment, no longer strong enough to be generally viable, difficult to rank	1	dps	atk,crit,killreset
1101	Bronya	2	A	Incredible potential, no meta dps to fit, one rank below Sunday at the minimum	2	support	dmg%,target,aura,atk,crit,spd,av
1013	Herta	2	A	Herta battery	6	dps,subdps	atk,crit,fua,waveclear
1009	Asta	6	N/A		6	support	
1008	Arlan	6	N/A		6	dps	
1006	Silver Wolf	2	A	Acheron battery	0	support	defshred,resshred,weakness,debuff,weakness_true
1005	Kafka	5	D	Perhaps too harsh, though considerably worse than Jingliu	0	dps	dot,atk
1004	Welt	6	N/A		2	dps,subdps	
1003	Himeko	6	N/A		2	dps,subdps	atk,crit,fua,break,waveclear
1002	Dan Heng	6	N/A		6	dps	
1001	March 7th	6	N/A		6	sustain	shielder,fua`

const tier_content_array = tier_content.split('\n').map(line => line.split('\t'));
const tier_content_headers = tier_content_array[0];
const tier_content_columns = [];
for (let i = 0; i < tier_content_headers.length; i++) {
  const column = [];
  for (let j = 1; j < tier_content_array.length; j++) {
    column.push(tier_content_array[j][i]);
  }
  tier_content_columns.push(column);
}
const tier_content_headers_index : any = {};
for (let i = 0; i < tier_content_headers.length; i++) {
  tier_content_headers_index[tier_content_headers[i]] = i;
}
// const tier_content_headers_index : any = {
//     "id": 0,
//     "name": 1,
//     "tier": 2,
//     "tier_name": 3,
//     "rational": 4,
//     "assumed_eidolon": 5,
//     "tag": 6,
//     "tag_detail": 7
// }





const get_from_tier = (tier: number) => {
    if (tier < 0 || tier > 6) return [];

    const rows = [];
    for (let i = 1; i < tier_content_array.length; i++) {
        // console.log()
        if (parseInt(tier_content_array[i][tier_content_headers_index['tier']]) === tier) {
            const row : any = {};
            for (let j = 0; j < tier_content_headers.length; j++) {
                row[tier_content_headers[j]] = tier_content_array[i][j];
            }
            row['id'] = parseInt(row['id']);
            row['tier'] = parseInt(row['tier']);
            row['tag'] = row['tag'].split(',');
            row['tag_detail'] = row['tag_detail'].split(',');
            
            rows.push(row);
        }
    }
    return rows;
}

const get_tiers = () => {
    const tiers = [];
    for (let i = 0; i < tier_details_columns[0].length; i++) {
        tiers.push({
            name: tier_details_columns[tier_details_headers_index['name']][i],
            name_alt: tier_details_columns[tier_details_headers_index['name_alt']][i],
            description: tier_details_columns[tier_details_headers_index['description']][i],
            tier: parseInt(tier_details_columns[tier_details_headers_index['tier']][i]),
            color: "#" + tier_details_columns[tier_details_headers_index['color']][i],
        });
    }
    return tiers;
}

const get_tier_data_from_char_id = (char_id: number) => {
    for (let i = 1; i < tier_content_array.length; i++) {
        if (parseInt(tier_content_array[i][tier_content_headers_index['id']]) === char_id) {
            const row : any = {};
            for (let j = 0; j < tier_content_headers.length; j++) {
                row[tier_content_headers[j]] = tier_content_array[i][j];
            }
            row['id'] = parseInt(row['id']);
            row['tier'] = parseInt(row['tier']);
            row['tag'] = row['tag'].split(',');
            row['tag_detail'] = row['tag_detail'].split(',');
            
            return row;
        }
    }
    return {
        id: char_id,
        name: "",
        tier: "6",
        tier_name: "N/A",
        rational: "",
        assumed_eidolon: "0",
        tag: [],
        tag_detail: [],
    }
}

const get_tier_details_from_tier = (tier: number) => {
    for (let i = 0; i < tier_details_columns[0].length; i++) {
        if (parseInt(tier_details_columns[tier_details_headers_index['tier']][i]) === tier) {
            const row : any = {};
            for (let j = 0; j < tier_details_headers.length; j++) {
                row[tier_details_headers[j]] = tier_details_columns[j][i];
            }
            row['tier'] = parseInt(row['tier']);
            row['color'] = "#" + row['color'];
            return row;
        }
    }
    return null;
}

export { get_from_tier, get_tiers, get_tier_data_from_char_id, get_tier_details_from_tier };