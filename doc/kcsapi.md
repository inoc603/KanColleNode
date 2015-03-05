KanColle API
============

This document is an analysis on the KanColle API data, decribing how each api
works.

##/api_port/port

API called when back to the home port

###Parameters

>api\_sort\_order=2  
api\_verno=1  
api\_port=int[28]  
api\_sort\_key=5  
api\_token=char[40]
>

###Response

- <h3>api_basic</h3>



	the basic information about the admiral

	**api\_active\_flag**:1, unknown  
	**api\_comment** "签名"  
	**api\_comment\_id** "签名对应ID"  
	**api\_count\_deck** 舰队数量  
	**api\_count\_kdock** 建造渠数量  
	**api\_count\_ndock** 修理渠数量  
	**api\_experience** 现有提督经验  
	**api\_fcoin** 家具币数量  
	**api\_firstflag** 1, unknon  
	**api\_fleetname** null, unknown  
	**api\_furniture** 当前母港家具，int[6]  
	**api\_large\_dock** 是否开启大型建造  
	**api\_level** 提督等级  
	**api\_max\_chara** 最大舰娘数量  
	**api\_max\_kagu**:0, unknown  
	**api\_max\_slotitem** 最大装备数量  
	**api\_medals** 应该是是否有甲鱼勋章吧  
	**api\_member\_id** "用户ID",  
	**api\_ms\_count** 远征总次数  
	**api\_ms\_success** 远征成功数  
	**api\_nickname** "提督昵称"  
	**api\_nickname\_id** "用户的昵称ID"  
	**api\_playtime**:0, unknown  
	**api\_pt\_challenged** 受演习挑战次数?  
	**api\_pt\_challenged\_win** 受演习挑战胜利次数  
	**api\_pt\_lose** 演习失败次数  
	**api\_pt\_win** 演习胜利数  
	**api\_pvp**:[0,0], unknown  
	**api\_rank** 提督军衔  
	**api\_st\_lose** 出击失败次数  
	**api\_st\_win** 出击胜利次数  
	**api\_starttime**:1424699340536, unsure the timestamp  
	**api\_tutorial** 是否需要教程  
	**api\_tutorial\_progress** 教程进度

