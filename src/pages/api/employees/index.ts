import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { employeeValidationSchema } from 'validationSchema/employees';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getEmployees();
    case 'POST':
      return createEmployee();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEmployees() {
    const data = await prisma.employee
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'employee'));
    return res.status(200).json(data);
  }

  async function createEmployee() {
    await employeeValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.attendance?.length > 0) {
      const create_attendance = body.attendance;
      body.attendance = {
        create: create_attendance,
      };
    } else {
      delete body.attendance;
    }
    if (body?.benefits?.length > 0) {
      const create_benefits = body.benefits;
      body.benefits = {
        create: create_benefits,
      };
    } else {
      delete body.benefits;
    }
    if (body?.offboarding?.length > 0) {
      const create_offboarding = body.offboarding;
      body.offboarding = {
        create: create_offboarding,
      };
    } else {
      delete body.offboarding;
    }
    if (body?.onboarding?.length > 0) {
      const create_onboarding = body.onboarding;
      body.onboarding = {
        create: create_onboarding,
      };
    } else {
      delete body.onboarding;
    }
    if (body?.payroll?.length > 0) {
      const create_payroll = body.payroll;
      body.payroll = {
        create: create_payroll,
      };
    } else {
      delete body.payroll;
    }
    if (body?.performance?.length > 0) {
      const create_performance = body.performance;
      body.performance = {
        create: create_performance,
      };
    } else {
      delete body.performance;
    }
    const data = await prisma.employee.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
