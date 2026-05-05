interface PasswordRulesProps {
    password: string
}

interface PasswordRuleItemProps {
    ok: boolean
    text: string
}

function PasswordRuleItem({ ok, text }: PasswordRuleItemProps) {
    const indicatorClass = ok ? "bg-green-500 border-green-500" : "border-slate-400"

    return (
        <div className="flex items-center gap-2 text-xs text-slate-600">
            <span
                className={`inline-block h-3 w-3 rounded-full border ${indicatorClass}`}
            />
            <span>{text}</span>
        </div>
    )
}

export function PasswordRules({ password }: PasswordRulesProps) {
    const hasMinLength = password.length >= 8
    const hasMixedCaseAndDigit =
        /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

    return (
        <div className="space-y-2 rounded-md bg-[#EEF3FF] p-4">
            <PasswordRuleItem ok={hasMinLength} text="At least 8 characters" />
            <PasswordRuleItem ok={hasMixedCaseAndDigit} text="One uppercase, lowercase, and digit" />
            <PasswordRuleItem ok={hasSpecialChar} text="One special character" />
        </div>
    )
}
