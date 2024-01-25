import typia from "typia";
export const validateCreateConversation = input => {
    const errors = [];
    const __is = (input, _exceptionable = true) => {
        const $io0 = (input, _exceptionable = true) => "string" === typeof input.receiver && ("string" === typeof input.message && input.message.length <= 1000) && (2 === Object.keys(input).length || Object.keys(input).every(key => {
            if (["receiver", "message"].some(prop => key === prop))
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
            const $vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.receiver || $report(_exceptionable, {
                    path: _path + ".receiver",
                    expected: "string",
                    value: input.receiver
                }), "string" === typeof input.message && (input.message.length <= 1000 || $report(_exceptionable, {
                    path: _path + ".message",
                    expected: "string & MaxLength<1000>",
                    value: input.message
                })) || $report(_exceptionable, {
                    path: _path + ".message",
                    expected: "(string & MaxLength<1000>)",
                    value: input.message
                }), 2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map(key => {
                    if (["receiver", "message"].some(prop => key === prop))
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
                expected: "CreateConversationDTO",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "CreateConversationDTO",
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
//# sourceMappingURL=create.dto.js.map