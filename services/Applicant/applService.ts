import Applicant from "../../models/applicantModel";

const createNewApplicant = async (body: any) => {
  const email = body.email;

  const findApplicant = await Applicant.findOne({ email: email });
  if (!findApplicant) {
    const newApplicant = await Applicant.create(body);
    return newApplicant;
  } else {
    throw new Error("Applicant already exist");
  }
};

const getApplicants = async () => {
  const applicant = await Applicant.find();
  return applicant;
};

export { createNewApplicant, getApplicants };
