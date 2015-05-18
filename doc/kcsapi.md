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
	**api\_comment** "ǩ��"  
	**api\_comment\_id** "ǩ����ӦID"  
	**api\_count\_deck** ��������  
	**api\_count\_kdock** ����������  
	**api\_count\_ndock** ����������  
	**api\_experience** �����ᶽ����  
	**api\_fcoin** �Ҿ߱�����  
	**api\_firstflag** 1, unknon  
	**api\_fleetname** null, unknown  
	**api\_furniture** ��ǰĸ�ۼҾߣ�int[6]  
	**api\_large\_dock** �Ƿ������ͽ���  
	**api\_level** �ᶽ�ȼ�  
	**api\_max\_chara** ���������  
	**api\_max\_kagu**:0, unknown  
	**api\_max\_slotitem** ���װ������  
	**api\_medals** Ӧ�����Ƿ��м���ѫ�°�  
	**api\_member\_id** "�û�ID",  
	**api\_ms\_count** Զ���ܴ���  
	**api\_ms\_success** Զ���ɹ���  
	**api\_nickname** "�ᶽ�ǳ�"  
	**api\_nickname\_id** "�û����ǳ�ID"  
	**api\_playtime**:0, unknown  
	**api\_pt\_challenged** ����ϰ��ս����?  
	**api\_pt\_challenged\_win** ����ϰ��սʤ������  
	**api\_pt\_lose** ��ϰʧ�ܴ���  
	**api\_pt\_win** ��ϰʤ����  
	**api\_pvp**:[0,0], unknown  
	**api\_rank** �ᶽ����  
	**api\_st\_lose** ����ʧ�ܴ���  
	**api\_st\_win** ����ʤ������  
	**api\_starttime**:1424699340536, unsure the timestamp  
	**api\_tutorial** �Ƿ���Ҫ�̳�  
	**api\_tutorial\_progress** �̳̽���

