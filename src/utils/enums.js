/* eslint-disable no-bitwise */
import { forEach } from "lodash";

const projectStatusEnum = ["NotStarted", "InProgress", "Completed"];
const projectStatusKrEnum = ["준비중", "진행중", "완료"];

const visibilityEnum = ["Public", "Private"];
const visibilityKrEnum = ["공개", "비공개"];

const memberRoleFlag = ["Programmer", "GraphicArtist", "SoundArtist", "GameDesigner", "ProjectManager"];
const memberRoleKrFlag = ["프로그래머", "그래픽", "사운드", "기획", "PM"];

function getMemberRoleString(roleFlags) {
  let toReturn = "";
  forEach(memberRoleKrFlag, (roleKr, index) => {
    const roleFlag = 1 << index;
    if (roleFlag & roleFlags) {
      if (toReturn.length !== 0) {
        toReturn += ", ";
      }
      toReturn += roleKr;
    }
  });
  return toReturn;
}

export { projectStatusEnum, projectStatusKrEnum, visibilityEnum, visibilityKrEnum, memberRoleFlag, memberRoleKrFlag, getMemberRoleString };
