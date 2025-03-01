import CoursesModel from "~/server/models/Courses";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);

    if (data.ParamsCat) {
      const filterArr = data.FilterArr;
      const selectedFiltersByType = {};
      const combinedFiltersByType = {};

      data.filter.forEach((selectedFilter) => {
        filterArr.forEach(({ type, kirilica }) => {
          if (selectedFilter === kirilica) {
            selectedFiltersByType[type] =
              selectedFiltersByType[type] || new Set();
            selectedFiltersByType[type].add(kirilica);

            combinedFiltersByType[type] =
              combinedFiltersByType[type] || new Set();
            combinedFiltersByType[type].add(selectedFilter);
          }
        });
      });

      const arrayCond = Object.entries(combinedFiltersByType).map(
        ([type, values]) => ({
          type,
          kirilica: { $in: Array.from(values) },
        })
      );

      const objfill = {
        category: data.ParamsCat,
        show_catalog: true, // Исключаем скрытые курсы
        ...(arrayCond.length > 0 && {
          $and: arrayCond.map((condition) => ({
            filter: { $elemMatch: condition },
          })),
        }),
      };

      const result = await CoursesModel.find(objfill)
        .select("-_id") // Исключаем _id
        .skip(data.sortPage)
        .limit(data.pageSize);

      const count = await CoursesModel.countDocuments(objfill);

      return { result, count };
    }

    if (data.ParamsCatChild) {
      const filterArr = data.FilterArr;
      const selectedFiltersByType = {};
      const combinedFiltersByType = {};

      data.filter.forEach((selectedFilter) => {
        filterArr.forEach(({ type, kirilica }) => {
          if (selectedFilter === kirilica) {
            selectedFiltersByType[type] =
              selectedFiltersByType[type] || new Set();
            selectedFiltersByType[type].add(kirilica);

            combinedFiltersByType[type] =
              combinedFiltersByType[type] || new Set();
            combinedFiltersByType[type].add(selectedFilter);
          }
        });
      });

      const arrayCond = Object.entries(combinedFiltersByType).map(
        ([type, values]) => ({
          type,
          kirilica: { $in: Array.from(values) },
        })
      );

      const objfill = {
        categorychild: data.ParamsCatChild,
        show_catalog: true, // Исключаем скрытые курсы
        ...(arrayCond.length > 0 && {
          $and: arrayCond.map((condition) => ({
            filter: { $elemMatch: condition },
          })),
        }),
      };

      const result = await CoursesModel.find(objfill)
        .select("-_id") // Исключаем _id
        .skip(data.sortPage)
        .limit(data.pageSize);

      const count = await CoursesModel.countDocuments(objfill);

      return { result, count };
    }

    if (data && !data.ParamsCat) {
      const objfill = { show_catalog: true }; // Фильтр для всех запросов

      const result = await CoursesModel.find(objfill)
        .select("-_id") // Исключаем _id
        .skip(data.sortPage || 0)
        .limit(data.pageSize || 10);

      const count = await CoursesModel.countDocuments(objfill);

      return { result, count };
    } else {
      const result = await CoursesModel.find({ show_catalog: true }).select(
        "-_id"
      ); // Исключаем _id
      return result;
    }
  } catch (err) {
    console.log(err);
    return [];
  }
});
