import React from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

//TODO - giống như 1 HÀM DÙNG CHUNG CHO CÁC COMPONENT

//! NHIỆM VỤ: GIÚP KHAI BÁO ĐỒNG LOẠT CÁC HOOK --> RETURN VỀ CÁC HÀM ĐÃ KHAI BÁO PHÍA TRÊN
const useRouting = () => {
  //TODO - khai báo tập trung ở 1 chỗ
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParam, setSearchParam] = useSearchParams();

  //TODO - Return về đối tượng
  return {
    location: location,
    params: params,
    navigate: navigate,
    searchParam: searchParam,
    setSearchParam: setSearchParam,
  };
};

export default useRouting;
