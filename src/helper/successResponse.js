export function createSuccessResponse(data, message = 'Success') {
    return {
      status: 'success',
      message,
      data,
    };
  }
  