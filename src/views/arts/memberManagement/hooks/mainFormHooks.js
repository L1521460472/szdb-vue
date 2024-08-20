/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-20 17:04:01
 */
import { reactive, onBeforeMount } from "vue";
import { deptTreeSelect,deptTreeSelect1 } from "@/api/system/user";


export default function ($vm) {
  /**
   * @description: 下拉框数据源
   */
  const listTypeInfo = reactive({
    enableList: [
      { key: "启用", value: true },
      { key: "停用", value: false },
    ],
    technologyRankList: [
      { key: "初级", value: 1 },
      { key: "中级", value: 2 },
      { key: "高级", value: 3 },
    ],
    depTreeList: [],
    depTreeAddList: []
  });

  const topFormInfo = reactive({
    data: {},
    labelWidth: "100px",
    fieldList: [

    ],
    filterConditionList: [
    ],
  });
  /** 查询部门列表 */
  const getDepartmentList = ()=> {
    deptTreeSelect().then(response => {
      listTypeInfo.depTreeList = response.data;
    });
  };
  /** 查询部门新增树列表 */
  const getDepartmentAddList = ()=> {
    deptTreeSelect1().then(response => {
      listTypeInfo.depTreeAddList = response.data.map((item)=>{
        if(item.children){
          item.children.map((item1)=>{
            if(item1.children){
              item1.children.map((item2)=>{
                if(item2.children){
                  item2.children.map((item3)=>{
                    if(item3.children){
                      item3.children.map((item4)=>{
                        if(item4.children){
                          item4.children.map((item5)=>{
                            if(item5.sysUser){
                              item5.children = item5.sysUser.map((p)=>{
                                p.id = p.userId
                                p.label = p.userName
                                return p
                              })
                            }
                            return item5
                          })
                        }else{
                          if(item4.sysUser){
                            item4.children = item4.sysUser.map((v)=>{
                              v.id = v.userId
                              v.label = v.userName
                              return v
                            })
                          }
                        }
                        return item4
                      })
                    }else{
                      if(item3.sysUser){
                        item3.children = item3.sysUser.map((t)=>{
                          t.id = t.userId
                          t.label = t.userName
                          return t
                        })
                      }
                    }
                    return item3
                  })
                }else{
                  if(item2.sysUser){
                    item2.children = item2.sysUser.map((s)=>{
                      s.id = s.userId
                      s.label = s.userName
                      return s
                    })
                  }
                }
                return item2
              })
            }
            return item1
          })
        }
        return item
      });
    });
  };
  onBeforeMount(()=>{
    getDepartmentList()
    getDepartmentAddList()
  })

  return {
    topFormInfo,
    listTypeInfo,
  };
}
