import getData from "./get-data";
import { findObjectInArray } from "./utils";

export default function getFunctions(dataSource: string) {
  let data: any = getData(dataSource);
  if (data === undefined) return [];

  const group = findObjectInArray({
    array: data.groups,
    key: "title",
    value: "Functions",
  });

  const classes = group?.children.map((child: any) => {
    const classData = findObjectInArray({
      array: data.children,
      key: "id",
      value: child,
    });
    return classData;
  });

  if (!classes) return [];

  return classes;
}
