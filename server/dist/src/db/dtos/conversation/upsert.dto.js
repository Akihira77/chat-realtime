import typia from "typia";
export const validateUpsertConversation = input => {
    const errors = [];
    const __is = (input, _exceptionable = true) => {
        const $io0 = (input, _exceptionable = true) => "string" === typeof input.sender && "string" === typeof input.receiver && ("string" === typeof input.message && input.message.length <= 1000) && (3 === Object.keys(input).length || Object.keys(input).every(key => {
            if (["sender", "receiver", "message"].some(prop => key === prop))
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
            const $vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.sender || $report(_exceptionable, {
                    path: _path + ".sender",
                    expected: "string",
                    value: input.sender
                }), "string" === typeof input.receiver || $report(_exceptionable, {
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
                }), 3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map(key => {
                    if (["sender", "receiver", "message"].some(prop => key === prop))
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
                expected: "UpsertConversationDTO",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "UpsertConversationDTO",
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
//# sourceMappingURL=upsert.dto.js.map