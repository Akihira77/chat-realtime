import typia from "typia";
export const validateRegisterRequest = input => {
    const errors = [];
    const __is = (input, _exceptionable = true) => {
        const $io0 = (input, _exceptionable = true) => "string" === typeof input.fullName && input.fullName.length <= 25 && ("string" === typeof input.phoneNumber && input.phoneNumber.length <= 12) && (2 === Object.keys(input).length || Object.keys(input).every(key => {
            if (["fullName", "phoneNumber"].some(prop => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input)) {
        const $report = typia.createValidateEquals.report(errors);
        ((input, _path, _exceptionable = true) => {
            const $join = typia.createValidateEquals.join;
            const $vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.fullName && (input.fullName.length <= 25 || $report(_exceptionable, {
                    path: _path + ".fullName",
                    expected: "string & MaxLength<25>",
                    value: input.fullName
                })) || $report(_exceptionable, {
                    path: _path + ".fullName",
                    expected: "(string & MaxLength<25>)",
                    value: input.fullName
                }), "string" === typeof input.phoneNumber && (input.phoneNumber.length <= 12 || $report(_exceptionable, {
                    path: _path + ".phoneNumber",
                    expected: "string & MaxLength<12>",
                    value: input.phoneNumber
                })) || $report(_exceptionable, {
                    path: _path + ".phoneNumber",
                    expected: "(string & MaxLength<12>)",
                    value: input.phoneNumber
                }), 2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map(key => {
                    if (["fullName", "phoneNumber"].some(prop => key === prop))
                        return true;
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    return $report(_exceptionable, {
                        path: _path + $join(key),
                        expected: "undefined",
                        value: value
                    });
                }).every(flag => flag))].every(flag => flag);
            return ("object" === typeof input && null !== input || $report(true, {
                path: _path + "",
                expected: "RegisterRequestDTO",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "RegisterRequestDTO",
                value: input
            });
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    };
};
//# sourceMappingURL=register.dto.js.map