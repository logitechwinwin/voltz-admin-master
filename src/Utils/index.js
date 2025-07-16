/* eslint-disable no-unused-vars */
import moment from "moment";
export default class Utils {
  static generateId() {
    return Math.ceil(Math.random() * 10000000);
  }

  static matchPassword(pass, c_pass) {
    if (!!pass && c_pass !== pass) {
      return true;
    }
    return false;
  }

  static isValidEmail(value) {
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    if (regex.test(value)) {
      return true;
    }
    return false;
  }

  static isNumber(str) {
    if (/^[0-9\b]+$/.test(str)) {
      return true;
    }
    return false;
  }

  static inRange(value, max) {
    if (value.length < max) {
      return true;
    }
    return false;
  }

  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static formatTime = (value) => {
    let hour = Math.floor(moment.duration(value, "seconds").asHours());
    let min = Math.floor(moment.duration(value, "seconds").minutes());
    let sec = Math.floor(moment.duration(value, "seconds").seconds());
    return `${hour > 9 ? hour : `0${hour}`}:${min > 9 ? min : `0${min}`}:${sec > 9 ? sec : `0${sec}`}`;
  };

  static removeUnderscore(str) {
    return str.split("_").join(" ");
  }

  static getRowNumber(current_page, per_page, index) {
    return (current_page - 1) * per_page + index + 1;
  }

  static acceptCSV() {
    return ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
  }

  static sortByName = (employees) => {
    const options = employees?.map((option) => {
      const firstLetter = option?.name[0]?.toUpperCase();
      return {
        firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
        ...option,
      };
    });
    options.sort((a, b) => a.firstLetter.localeCompare(b.firstLetter));
    return options;
  };

  static limitStringWithEllipsis(str, limit) {
    if (str?.length <= limit) {
      return str;
    }
    return str?.substring(0, limit - 3) + "...";
  }

  static getHighestRole = (roles) => {
    const roleHierarchy = {
      admin: 4,
      storeManager: 3,
      locationManager: 2,
      scheduler: 1,
    };
    return roles?.reduce((highestRole, role) => {
      return roleHierarchy[role] > roleHierarchy[highestRole] ? role : highestRole;
    }, roles[0]);
  };

  static formatText(text) {
    return text
      .split(" ")
      .map((word) => word.toLowerCase())
      .join("_");
  }

  // Utility function to create query string from an object
  static buildQueryString(params) {
    return Object.entries(params)
      .filter(([_, value]) => value !== "all" && value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(typeof value === 'object' ? value?.id : value)}`)
      .join("&");
  }
}
