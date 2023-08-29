db.local.aggregate([
    {
        $match : {
            sub_category : "의회비"
        }
    },
    {
        $group : {
            _id : "$city_or_province",
            former_expense_max : {
                $max : "$former_expense"
            }
        }
    },
    {
        $sort : {
            former_expense_max : -1
        }
    }
]);