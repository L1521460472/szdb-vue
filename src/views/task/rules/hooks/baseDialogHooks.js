/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-04-10 17:08:21
 */
import { ref, reactive, watch, nextTick } from "vue";
import { getToken } from "@/utils/auth";
// import { useRouter } from 'vue-router'
export default function ($vm) {
  const userName = ref("userName");

  return {
    userName,
  };
}
