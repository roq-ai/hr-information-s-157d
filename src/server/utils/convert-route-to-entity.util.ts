const mapping: Record<string, string> = {
  attendances: 'attendance',
  benefits: 'benefits',
  companies: 'company',
  employees: 'employee',
  offboardings: 'offboarding',
  onboardings: 'onboarding',
  payrolls: 'payroll',
  performances: 'performance',
  policies: 'policy',
  recruitments: 'recruitment',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
